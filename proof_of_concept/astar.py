import sys
level = sys.argv[1]
token = '<YOUR TOKEN HERE>'
import csv
with open(str(level) + '.csv', 'rb') as f:
    reader = csv.reader(f)
    grid = list(reader)

# A* Shortest Path Algorithm
# http://en.wikipedia.org/wiki/A*
# FB - 201012256
from heapq import heappush, heappop # for priority queue
import math
import time
import random
import requests

class node:
    xPos = 0 # x position
    yPos = 0 # y position
    idistance = 0 # total distance already travelled to reach the node
    priority = 0 # priority = distance + remaining distance estimate
    def __init__(self, xPos, yPos, distance, priority):
        self.xPos = xPos
        self.yPos = yPos
        self.distance = distance
        self.priority = priority
    def __lt__(self, other): # comparison method for priority queue
        return self.priority < other.priority
    def updatePriority(self, xDest, yDest):
        self.priority = self.distance + self.estimate(xDest, yDest) * 10 # A*
    # give higher priority to going straight instead of diagonally
    def nextMove(self, dirs, d, weight): # d: direction to move
        if dirs == 8 and d % 2 != 0:
            self.distance += 14
        else:
            self.distance += 10 * weight
    # Estimation function for the remaining distance to the goal.
    def estimate(self, xDest, yDest):
        xd = xDest - self.xPos
        yd = yDest - self.yPos
        # Euclidian Distance
        d = math.sqrt(xd * xd + yd * yd)
        # Manhattan distance
        # d = abs(xd) + abs(yd)
        # Chebyshev distance
        # d = max(abs(xd), abs(yd))
        return(d)

# A-star algorithm.
# The path returned will be a string of digits of directions.
def pathFind(the_map, n, m, dirs, dx, dy, xA, yA, xB, yB):
    closed_nodes_map = [] # map of closed (tried-out) nodes
    open_nodes_map = [] # map of open (not-yet-tried) nodes
    dir_map = [] # map of dirs
    row = [0] * n
    for i in range(m): # create 2d arrays
        closed_nodes_map.append(list(row))
        open_nodes_map.append(list(row))
        dir_map.append(list(row))

    pq = [[], []] # priority queues of open (not-yet-tried) nodes
    pqi = 0 # priority queue index
    # create the start node and push into list of open nodes
    n0 = node(xA, yA, 0, 0)
    n0.updatePriority(xB, yB)
    heappush(pq[pqi], n0)
    open_nodes_map[yA][xA] = n0.priority # mark it on the open nodes map

    # A* search
    while len(pq[pqi]) > 0:
        # get the current node w/ the highest priority
        # from the list of open nodes
        n1 = pq[pqi][0] # top node
        n0 = node(n1.xPos, n1.yPos, n1.distance, n1.priority)
        x = n0.xPos
        y = n0.yPos
        heappop(pq[pqi]) # remove the node from the open list
        open_nodes_map[y][x] = 0
        closed_nodes_map[y][x] = 1 # mark it on the closed nodes map

        # quit searching when the goal is reached
        # if n0.estimate(xB, yB) == 0:
        if x == xB and y == yB:
            # generate the path from finish to start
            # by following the dirs
            path = ''
            while not (x == xA and y == yA):
                j = dir_map[y][x]
                c = str((j + dirs / 2) % dirs)
                path = c + path
                x += dx[j]
                y += dy[j]
            return path

        # generate moves (child nodes) in all possible dirs
        for i in range(dirs):
            xdx = x + dx[i]
            ydy = y + dy[i]
            if not (xdx < 0 or xdx > n-1 or ydy < 0 or ydy > m - 1
                    or the_map[ydy][xdx] == '1' or closed_nodes_map[ydy][xdx] == 1):
                # generate a child node
                weight = 1
                if the_map[ydy][xdx] == '2':
                    weight = 2
                if the_map[ydy][xdx] == '3':
                    weight = 5
                if the_map[ydy][xdx] == '4':
                    weight = 1000000

                m0 = node(xdx, ydy, n0.distance, n0.priority)
                m0.nextMove(dirs, i, weight)
                m0.updatePriority(xB, yB)
                # if it is not in the open list then add into that
                if open_nodes_map[ydy][xdx] == 0:
                    open_nodes_map[ydy][xdx] = m0.priority
                    heappush(pq[pqi], m0)
                    # mark its parent node direction
                    dir_map[ydy][xdx] = (i + dirs / 2) % dirs
                elif open_nodes_map[ydy][xdx] > m0.priority:
                    # update the priority
                    open_nodes_map[ydy][xdx] = m0.priority
                    # update the parent direction
                    dir_map[ydy][xdx] = (i + dirs / 2) % dirs
                    # replace the node
                    # by emptying one pq to the other one
                    # except the node to be replaced will be ignored
                    # and the new node will be pushed in instead
                    while not (pq[pqi][0].xPos == xdx and pq[pqi][0].yPos == ydy):
                        heappush(pq[1 - pqi], pq[pqi][0])
                        heappop(pq[pqi])
                    heappop(pq[pqi]) # remove the target node
                    # empty the larger size priority queue to the smaller one
                    if len(pq[pqi]) > len(pq[1 - pqi]):
                        pqi = 1 - pqi
                    while len(pq[pqi]) > 0:
                        heappush(pq[1-pqi], pq[pqi][0])
                        heappop(pq[pqi])       
                    pqi = 1 - pqi
                    heappush(pq[pqi], m0) # add the better node instead
    return '' # if no route found

moves = []

def startLevel(i):
    url = 'http://localhost:8888/level/' + str(i) + '/start'
    headers = {'Content-Type': 'application/json', 'x-token': token}
    r = requests.post(url, headers=headers)
    print(r.text);

def endLevel(i):
    url = 'http://localhost:8888/level/' + str(i) + '/end'
    headers = {'Content-Type': 'application/json', 'x-token': token}
    r = requests.post(url, headers=headers)
    print(r.text);

def getStatus():
    url = 'http://localhost:8888/player/status'
    headers = {'Content-Type': 'application/json', 'x-token': token}
    r = requests.get(url, headers=headers)
    print(r.text);

def movePlayer(direction):
    #url = 'http://localhost:8888/player/' + direction
    #headers = {'Content-Type': 'application/json', 'x-token': token}
    #r = requests.put(url, headers=headers)
    moves.append(direction)

def moveBulk():
    if len(moves) > 1000:
        sendMoves = moves[-10:]
        del moves[-10:]
        moveBulk()
    else:
        sendMoves = moves
    url = 'http://localhost:8888/player/bulk'
    headers = {'Content-Type': 'application/json', 'x-token': token}
    r = requests.put(url, headers=headers, json=sendMoves)

# MAIN
dirs = 4 # number of possible directions to move on the map
if dirs == 4:
    dx = [1, 0, -1, 0]
    dy = [0, 1, 0, -1]
elif dirs == 8:
    dx = [1, 1, 0, -1, -1, -1, 0, 1]
    dy = [0, 1, 1, 1, 0, -1, -1, -1]

the_map = grid

def goRoute(xA, yA, xB, yB):

    print 'Map size (X,Y): ', n, m
    print 'Start: ', xA, yA
    print 'Finish: ', xB, yB
    t = time.time()
    route = pathFind(the_map, n, m, dirs, dx, dy, xA, yA, xB, yB)
    print 'Time to generate the route (seconds): ', time.time() - t
    print 'Route:'
    print route


    # mark the route on the map
    if len(route) > 0:
        x = xA
        y = yA
        the_map[y][x] = 2
        for i in range(len(route)):
            j = int(route[i])
            x += dx[j]
            y += dy[j]
        
            if dy[j] == 1:
                movePlayer("down")
            if dy[j] == -1:
                movePlayer("up")
            if dx[j] == 1:
                movePlayer("right")
            if dx[j] == -1:
                movePlayer("left")

            the_map[y][x] = '5'
        the_map[y][x] = '5'


    # display the map with the route added
    print 'Map:'
    for y in range(m):
        for x in range(n):
            xy = the_map[y][x]
            if xy == '0':
                print '.', # space
            elif xy == '1':
                print '+', # obstacle
            elif xy == '2':
                print 't', # start
            elif xy == '3':
                print 'A', # route
            elif xy == '4':
                print '~', # finish
            elif xy == '5':
                print 'X', # finish
        print


startLevel(level)

if level == '1':
    n = 10
    m = 10

    goRoute(1, 1, 8, 8)

if level == '2':
    n = 60 # horizontal size of the map
    m = 70 # vertical size of the map

    # start and destination
    goRoute(5, 5, 54, 60)

if level == '3':
    n = 600 # horizontal size of the map
    m = 50 # vertical size of the map

    # start and destination
    goRoute(3, 16, 595, 30)

if level == '4':
    n = 150 # horizontal size of the map
    m = 150 # vertical size of the map

    # start and destination
    goRoute(3, 3, 138, 139)

if level == '5':
    n = 200 # horizontal size of the map
    m = 200 # vertical size of the map

    # start and destination
    goRoute(1, 1, 191, 188)

if level == '6':
    n = 500 # horizontal size of the map
    m = 500 # vertical size of the map

    # start and destination
    goRoute(4, 4, 478, 488)

if level == '7':
    n = 500 # horizontal size of the map
    m = 500 # vertical size of the map

    # start and destination
    goRoute(4, 4, 478, 488)

if level == '8':
    n = 100 # horizontal size of the map
    m = 100 # vertical size of the map

    # start and destination
    goRoute(1, 99, 5, 95)
    goRoute(5, 95, 5, 65)
    goRoute(5, 65, 5, 5)
    goRoute(5, 5, 5, 65)
    goRoute(5, 65, 85, 95)
    goRoute(85, 95, 95, 95)
    goRoute(95, 95, 35, 65)
    goRoute(35, 65, 35, 45)
    goRoute(35, 45, 55, 5)
    goRoute(55, 5, 95, 5)

if level == '9':
    n = 200 # horizontal size of the map
    m = 200 # vertical size of the map

    # start and destination
    goRoute(10, 190, 19, 18)
    goRoute(19, 18, 30, 37)
    goRoute(30, 37, 24, 84)
    goRoute(24, 84, 24, 132)
    goRoute(24, 132, 23, 168)
    goRoute(23, 168, 55, 167)
    goRoute(55, 167, 92, 33)
    goRoute(92, 33, 69, 55)
    goRoute(69, 55, 93, 106)
    goRoute(93, 106, 121, 69)
    goRoute(121, 69, 129, 149)
    goRoute(129, 149, 145, 110)
    goRoute(145, 110, 170, 27)
    goRoute(170, 27, 182, 72)
    goRoute(182, 72, 178, 164)
 
if level == '10':
    n = 400
    m = 400

    goRoute(6, 5, 358, 369)

print moves  
moveBulk()
endLevel(level)

raw_input('Press Enter...')
