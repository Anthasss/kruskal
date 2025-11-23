import { createUnionFind } from './unionFind';
import { parseGeoJSON } from './geojsonParser';
import { pruneUnnamedLeaves } from './mstPruner';

export function kruskalMST(geojsonData) {
  // return early if no data
  if (!geojsonData) return { edges: [], vertices: [] };

  // extract vertices and edges from geojson data
  const { vertices, edges } = parseGeoJSON(geojsonData);

  // sort edges by distance (shortest first)
  edges.sort((a, b) => a.distance - b.distance);

  // build mst.
  const uf = createUnionFind(vertices.length);
  const mstEdges = [];

  for (const edge of edges) {
    // try to add edge, if create cycle returns false
    if (uf.union(edge.fromIndex, edge.toIndex)) {
      mstEdges.push(edge);
      
      // mst is complete when we have (vertices - 1) edges
      if (mstEdges.length === vertices.length - 1) {
        break;
      }
    }
  }

  // prune unnamed unimportant roads
  const prunedEdges = pruneUnnamedLeaves(mstEdges, vertices);

  return { edges: prunedEdges, vertices };
}

