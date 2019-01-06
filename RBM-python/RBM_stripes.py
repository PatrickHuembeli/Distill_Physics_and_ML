#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
RBM to learn bars and stripes images
@Marcos Perez
"""
import numpy as np
import matplotlib.pyplot as plt
import torch
import torch.utils.data
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
from RBM_helper import RBM
from torch.autograd import Variable
import os

batch_size = 512
#epochs = 500 # More epochs test
epochs = 200
gpu = False

## Loading the images from the file
data = np.load('bars_and_stripes.npy')
dims = data.shape
# Flattening the data into 16-dimensional vectors
data = data.flatten().reshape([dims[0], dims[1]*dims[2]])
data = torch.FloatTensor(data)

## Starting the Machinery
vis = dims[1]*dims[2]   # Number of visible layers
# Number of hidden layers? (Two options)
option = int(input("Select the number of hidden layers:\n 0: hidden = visible\n 1: hidden = visible/4\n>>> "))
nhidden = vis//4 if option else vis
# Number of Gibbs' sampling steps? (Two options again)
option2 = int(input("Select the number of sampling steps:\n 0: k = 1\n 1: k = 4\n>>> "))
k = 4 if option2 else 1
rbm = RBM(n_vis=vis, n_hin=nhidden, k=k, gpu=gpu) #Creation of the RBM

# Trying to set up GPU acceleration
if gpu:
    rbm = rbm.cuda()
    all_spins = all_spins.cuda()

train_loader = torch.utils.data.DataLoader(data, batch_size=batch_size,
        shuffle=True)

for epoch in range(epochs):
    # loading data into the RBM
    train_loader = torch.utils.data.DataLoader(data, batch_size=batch_size,
            shuffle=True)
    if (epoch % 50 == 0) or (epoch == 0):
        print(epoch)
    # Faster as the epochs increase
    momentum = 1-.1*(epochs-epoch)/epochs
    # Learnig rate. Faster initially, slower at the end
    lr = .1*np.exp(-epoch/epochs)+1e-4
    # Training the RBm with this parameters
    rbm.train(train_loader, lr=lr, momentum=momentum)

n = 16 # Samples to draw

# Saving samples generated by the RBM
files = os.listdir()
new_dir = "Imatges"
if new_dir not in files:
    os.mkdir(new_dir)
os.chdir(new_dir)
#fig, axes = plt.subplots(1, n, figsize=(10,7))
for i in range(n):
    a = rbm.draw_sample(dims[1]*dims[2], initial_im=data[0,:])
    print(a)
    a = a.reshape([dims[1], dims[2]])
    if option:
        plt.imsave("rbm_hidden-{:02n}.png".format(i), a)
    else:
        plt.imsave("rbm_stripe-not_random-{:02n}.png".format(i), a)
#    axes[i].imshow(a)
#plt.tight_layout()
#fig.savefig("FigureX.pdf")
