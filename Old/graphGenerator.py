import networkx as nx
import matplotlib.pyplot as plt
import random as rn 

num_nodes = 20
p = 0.15
path_len = 5

er = nx.erdos_renyi_graph(num_nodes, p)
nx.draw(er)

plt.show()
plt.savefig('erdos-renyi.png')

path = []
node = rn.randint(0,num_nodes)
path.append(node)

for i in range(path_len):
	edges = er.edges(node)
	itr = rn.randint(0, len(edges)-1)
	next_node = edges[itr][1]
	path.append(next_node)
	node = next_node

print(path)
