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
import pickle

# obrint el pot de cogombres
with open("rbm_mnist_lessbatch.pkl", "rb") as f:
    rbm = pickle.load(f)

damag = np.load("RBM_blanked_test_images.npy")
#damag = np.load("RBM_test_images.npy")
dims = damag.shape
damag = damag.flatten().reshape([dims[0], dims[1]*dims[2]])
damag = torch.FloatTensor(damag)

for i in range(dims[0]):
    recon = rbm.draw_sample(dims[1]*dims[2], damag[i,:])
    recon = recon.reshape([dims[1], dims[2]])
    plt.imsave("recon_{:02d}.png".format(i), recon)
    plt.imsave("recon_ref_{:02d}.png".format(i), damag[i].reshape([dims[1], dims[2]]))
