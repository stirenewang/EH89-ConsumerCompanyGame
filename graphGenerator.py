import networkx as nx
import matplotlib.pyplot as plt

er = nx.erdos_renyi_graph(100, 0.15)
# nx.clustering(er)
nx.draw(er)

'''
Generating an Erdos-Renyi Graph:
https://networkx.github.io/documentation/development/tutorial/tutorial.html
https://networkx.github.io/documentation/development/reference/generators.html

'''
plt.show()
plt.savefig("erdos-renyi.png")