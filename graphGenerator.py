import networkx as nx
import matplotlib.pyplot as plt
import random as rn 

nodeNum = 100
p = 0.15
pathNum = 5 # Get a path for the consumer- company network

er = nx.erdos_renyi_graph(nodeNum, p)
# nx.clustering(er)
nx.draw(er)

'''
Generating an Erdos-Renyi Graph:
https://networkx.github.io/documentation/development/tutorial/tutorial.html
https://networkx.github.io/documentation/development/reference/generators.html

'''
#plt.show()
#plt.savefig("erdos-renyi.png")

#print(er.number_of_nodes()) 
#print(er.edges())  # get all edges
#print(er.edges(0)) # get edges of node 0 

path = []
# random start point
node = rn.randint(0,nodeNum)
path.append(node)
for i in range(pathNum):
	edges = er.edges(node)
	#print(edges)
	itr = rn.randint(0, len(edges)-1)
	nextNode = edges[itr][1]
	path.append(nextNode)
	node = nextNode

print(path) 
# get a path for the consumer to find. (give them a start node. 
# They are to try to find the end node)
