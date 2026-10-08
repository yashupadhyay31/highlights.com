// server/services/deduplicationService.js
const Event = require('../models/Event');

/**
 * Calculate Jaccard similarity coefficient between two strings (0.0 to 1.0)
 */
function calculateJaccardSimilarity(textA = '', textB = '') {
  const wordsA = new Set(textA.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(textB.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  let intersection = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) intersection++;
  }

  const union = new Set([...wordsA, ...wordsB]).size;
  return intersection / union;
}

/**
 * Extract key named entities/topics for fast clustering check
 */
function extractKeyEntities(text = '') {
  const normalized = text.toLowerCase();
  const keywords = ['israel', 'gaza', 'ukraine', 'russia', 'china', 'taiwan', 'iran', 'us', 'syria', 'north korea', 'paris', 'tokyo', 'earthquake', 'typhoon', 'wildfire', 'strike', 'protest', 'election'];
  return keywords.filter(k => normalized.includes(k));
}

/**
 * Check if two events should be merged into the same cluster
 */
function shouldClusterEvents(eventA, eventB) {
  // Must be same category
  if (eventA.category !== eventB.category) return false;

  // Geo proximity match (same city/country or lat/lng within ~1.5 degrees (~150km))
  const countryMatch = eventA.location?.country && eventB.location?.country &&
    eventA.location.country.toLowerCase() === eventB.location.country.toLowerCase();

  const latDiff = Math.abs((eventA.location?.lat || 0) - (eventB.location?.lat || 0));
  const lngDiff = Math.abs((eventA.location?.lng || 0) - (eventB.location?.lng || 0));
  const geoProximity = (latDiff <= 2.0 && lngDiff <= 2.0);

  if (!countryMatch && !geoProximity) return false;

  // Text similarity check
  const similarity = calculateJaccardSimilarity(eventA.title + ' ' + (eventA.summary || ''), eventB.title + ' ' + (eventB.summary || ''));
  if (similarity >= 0.30) return true;

  // Entity overlap check
  const entitiesA = extractKeyEntities(eventA.title);
  const entitiesB = extractKeyEntities(eventB.title);
  const sharedEntities = entitiesA.filter(e => entitiesB.includes(e));

  return (countryMatch || geoProximity) && sharedEntities.length >= 2;
}

/**
 * Automated AI Cluster Merging & Deduplication Background Service
 * Clusters duplicate news outlets reporting on the same story into a single core Event Dossier.
 */
async function deduplicateEvents() {
  try {
    console.log('[DeduplicationService] Starting automated AI event cluster deduplication...');
    const allEvents = await Event.find({}).sort({ publishedAt: -1 }).lean();

    if (allEvents.length < 2) {
      return { clustersFound: 0, mergedEventsCount: 0, removedDuplicatesCount: 0 };
    }

    const visited = new Set();
    const clusters = [];

    for (let i = 0; i < allEvents.length; i++) {
      const primary = allEvents[i];
      if (visited.has(primary._id.toString())) continue;

      const clusterGroup = [primary];
      visited.add(primary._id.toString());

      for (let j = i + 1; j < allEvents.length; j++) {
        const candidate = allEvents[j];
        if (visited.has(candidate._id.toString())) continue;

        if (shouldClusterEvents(primary, candidate)) {
          clusterGroup.push(candidate);
          visited.add(candidate._id.toString());
        }
      }

      if (clusterGroup.length > 1) {
        clusters.push(clusterGroup);
      }
    }

    let mergedEventsCount = 0;
    let removedDuplicatesCount = 0;

    // Process clusters: Merge sources and update primary dossier
    for (const group of clusters) {
      // Pick primary event (the one with the longest summary or earliest timestamp)
      group.sort((a, b) => (b.summary?.length || 0) - (a.summary?.length || 0));
      const primary = group[0];
      const duplicates = group.slice(1);

      // Consolidate unique source outlets
      const existingSources = new Map();
      (primary.sources || []).forEach(s => {
        if (s.name) existingSources.set(s.name.toLowerCase(), s);
      });

      duplicates.forEach(dup => {
        (dup.sources || []).forEach(s => {
          if (s.name && !existingSources.has(s.name.toLowerCase())) {
            existingSources.set(s.name.toLowerCase(), s);
          }
        });
        if (dup.sourceUrl && !Array.from(existingSources.values()).some(s => s.url === dup.sourceUrl)) {
          existingSources.set(`outlet-${Date.now()}-${Math.random()}`, {
            name: dup.source || 'Wire Outlet',
            type: 'Media',
            credibility: 75,
            url: dup.sourceUrl
          });
        }
      });

      const consolidatedSources = Array.from(existingSources.values());
      const duplicateIds = duplicates.map(d => d._id);

      // Update primary event with multi-source cluster telemetry
      const updatedSummary = primary.summary.includes('[Multi-Source Cluster')
        ? primary.summary
        : `${primary.summary} [Multi-Source Cluster: ${consolidatedSources.length} media outlets reporting]`;

      const verificationStatus = consolidatedSources.length >= 2 ? 'VERIFIED' : primary.verificationStatus;

      await Event.findByIdAndUpdate(primary._id, {
        sources: consolidatedSources,
        summary: updatedSummary,
        verificationStatus,
        'communityTrust.trustPercentage': consolidatedSources.length >= 2 ? 96 : (primary.communityTrust?.trustPercentage || 90)
      });

      // Remove duplicate redundant event records from MongoDB
      await Event.deleteMany({ _id: { $in: duplicateIds } });

      mergedEventsCount++;
      removedDuplicatesCount += duplicates.length;
    }

    console.log(`[DeduplicationService] AI Deduplication Complete. Created ${mergedEventsCount} clusters and merged ${removedDuplicatesCount} duplicate articles.`);

    return {
      clustersFound: clusters.length,
      mergedEventsCount,
      removedDuplicatesCount
    };
  } catch (err) {
    console.error('[DeduplicationService] Error during event deduplication:', err.message);
    throw err;
  }
}

module.exports = {
  calculateJaccardSimilarity,
  shouldClusterEvents,
  deduplicateEvents
};
