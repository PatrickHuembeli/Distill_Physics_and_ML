Especially the Hopfield network was studied extensively by physicist and this post will help to understand why this particular model should get that much attention.

Boltzmann machines have an interesting history. Boltzmann was an Austrian scientist who worked on statistical descriptions of physics in the 1800s. His name is tied to a number of theories and results that are still in common use today: Boltzmann’s constant, Boltzmann’s equation, Maxwell-Boltzmann statistics, and the Boltzmann distribution. Boltzmann did not, however, invent Boltzmann machines.

<em>Jaynes’ principle</em> is named after the 19th century physicist E. T. Jaynes. This principle, also called t
Jaynes showed how to arrive at the Boltzmann distribution from the principle of maximum entropy, and derivations can be found in several textbooks.

<p>The energy function is not unique to Boltzmann machines and occurs in a huge class of models that are summarized under the name energy-based models. The basic idea of energy-based models is to capture the different possible configurations of a system through a single scalar quantity, called the energy.  the formula
<d-math block> p(x) \propto \exp(-\beta E(x)), </d-math>
where <d-math>\beta</d-math> is an arbitrary positive number (in physics, this is called the <em>inverse temperature</em>). There are a number of arguments which can lead us to this formula. The simplest is perhaps that the exponential function is the most straightforward way to map the real line (the domain of <d-math>\beta</d-math>) into positive numbers, which we could then normalize to probabilities. A more elaborate way to define it is the principle of maximum entropy that we have shown before.</p>

For non-zero temperature models, the updates work similarly, just that the update is not deterministic, but there is a probability assigned to every node <d-math>\sigma_i</d-math> according to its input strength <d-math>\sum_j W_{ij} \sigma_j + h_i</d-math>. And according to this probability we update the spins.

<p>We would to close the loop between the principle of maximum entropy and the maximum likelihood estimation. Boltzmann machines are a choice for an ansatz for the probability distribution and the parameters of the model are adjusted such that the data is maximally likely. Therefore the expectation values <d-math>\langle \sigma_i \rangle</d-math> and <d-math>\langle \sigma_i \sigma_j \rangle</d-math> are not constraints of the model they are the objectives to be maximally likely.</p>

<!-- <figure style = "width:100%; height:600px; display:block; margin-left:auto; margin-right:auto; position:relative" id = "RBM_complete">
<div id = "RBM_complete_id" style="position:absolute; left:0px; top:0px"></div>
</figure>

<script type = "text/javascript" src = "figures/RBM_complete.js" ></script>
-->


<p>How can we train energy-based models to generate good samples? The common starting point is to begin with a mathematically motivated cost function, e.g., the Kullback-Leiber divergence or the log-likelihood, which represents how probable it is for the model to produce samples which are in a target distribution. The gradient of this cost formula is taken, and, after some manipulation, one arrives at a specific analytic formula which provides a first-order update rule for the model's parameters. If the energy function is <d-math>E(x) = \sum_i \theta_i x_i</d-math>, with the
parameters of the model given by <d-math>\theta</d-math> <strong>[NB: for now, ignoring hidden/visible or RBM distinction]</strong>, and <d-math>\eta</d-math> is some chosen learning rate, then the update rule has the compact form
</p>

<d-math block>\theta_i\rightarrow\theta_i + \eta \left[\langle x_i \rangle_{\mathrm{data}} - \langle x_i\rangle_{\mathrm{model}}\right].</d-math>

<p>In this update rule, averages <d-math>\langle\cdots\rangle </d-math> of the quantities <d-math>x_i</d-math> are taken with respect to both the data distribution (i.e., by averaging these values in the training dataset) and the distribution produced by the model (this is usually estimated by sampling from the model a finite number of times). After each step of gradient descent, these expectation values should get more and more similar to the corresponding values from the data distribution.
</p>

<p>Rather than deriving this equation, as is done in many other treatments, we will instead try 
