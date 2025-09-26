const resourceProxyExistsInRequestChain = ({
  moduleGraph,
  issuerModule,
  proxyResource
}) => {
  const queue = [issuerModule];
  const visited = new WeakSet();
  while (queue.length) {
    const node = queue.shift();
    if (node.resource === proxyResource) {
      return true;
    }

    if (visited.has(node)) {
      continue;
    }
    visited.add(node);

    const incomingConnections = moduleGraph.getIncomingConnections(node);
    queue.push(
      ...new Set(
        [...incomingConnections]
          .map(({ originModule }) => originModule)
          .filter(Boolean)
      )
    );
  }
  return false;
};

export default resourceProxyExistsInRequestChain;
