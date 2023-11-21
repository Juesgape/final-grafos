class Graph {
    constructor() {
        this.nodes = 0;
        this.adjacentList = {};
    }

    addVertex(node) {
        if(!this.adjacentList[node]) {
            this.adjacentList[node] = {}
            this.nodes++
            return
        }

        return 'Vertex was already added'
    }

    addEdge(graphNode, newNodeKey, weight, newNodeValue) {
        // Asegúrate de que exista el nodo principal
        if (!this.adjacentList[graphNode][newNodeKey]) {
            this.adjacentList[graphNode][newNodeKey] = {};
        }

        // Asegúrate de que exista la etiqueta de peso
        if (!this.adjacentList[graphNode][newNodeKey][weight]) {
            this.adjacentList[graphNode][newNodeKey][weight] = [];
        }
        // Agrega la nueva arista al array
        this.adjacentList[graphNode][newNodeKey][weight].push(newNodeValue);
    }
}

export {
    Graph
}