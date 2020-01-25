
// COLORS FIGURE 1 (Temperature, coupling and probability)
var 	c_histo_bars = "blue" 			//Color of the histogram bars
	c_hid_node1 = "rgb(0,0,255,0.5)" 	// Color1 hidden node
	c_hid_node2 = "rgb(255,0,0,0.5)" 	// Color2 hidden node
	c_hid_node1_stroke = "blue" 		// Stroke color1 hidden node
	c_hid_node2_stroke = "red" 		// Storke color2 hidden node
	c1_2D_slider = "white" 			// Slider background color1 (2 COLORS BECAUSE IT IS A GRADIENT)
	c2_2D_slider = "grey" 			// Slider background color2
	c_handle_2D_slider = "orange" 		// SLider Handle color
	c_stroke_2D_slider = "white" 		// Slider lines and circle stroke color 
        handle_2D_slider_radius = 8
	c_text_slider = "grey" 			// Slider Text color
	c_text_histogram = "grey" 		// Histogram text color

// COLORS FIGURE 2 (ARCHITECTURE)

var 	c_vis_node1 = "white" 			// Color for visible nodes
	c_vis_node2 = "black" 			// Hidden nodes colors are defined in Figure 1
	c_vis_node1_stroke = "black"
	c_vis_node2_stroke = "black"
	c_architecture_connection = "grey"  	// Connections color in architectures

	// OTHER STYLE PARAMETERS FOR FIGURE 2
	var 	connection_stroke_width = 2 	// width of the connection lines
		nodes_stroke_width = 1 		// Stroke width of the nodes
		nodes_radius = 12 		// Radius of the RBM nodes

// COLORS FIGURE 3 (Temp dependent convergence)
var c_energy_line = "blue"  // Color of energy line (Also for Figure 4)
    c_inactive_dot = "#ffab00" // Color of iniactive dots
    c_active_dot = "red" // Color of active dot
    c_stroke_dot_inactive = "#fff"
    c_stroke_dot_active = "black"
    c1_temp_background = "blue" // Background lower color
    c2_temp_background = "white" // Background upper color
    opacity1_temp_background = 0.5 // Opacity lower color
    opacity2_temp_background = 0.5 // Opacity upper color
    temp_grad_offset = "50%" 	//This value determines, From when on gradient stops.
				//The smaller the value the further up blue goes.
   
	// Other Style Parameter FOR FIGURE 3
	var r_inactive_dot = 4.0 // Radius of inactive dot 
	    r_active_dot = 5.0   // Radius of active dot
            stroke_energy_line = 3.0 // stroke thickness energy line
	// Convergence Parameters
	var time_steps_convergence = 400; // time parameter for convergence speed
	var nr_of_steps_per_loop = 100; // # of steps after starting convergence

// Spring Figure
// The grad arrow sum was generated by https://www.strangeplanet.fr/work/gradient-generator/index.php
// This is so far the easiest way to do the color gradient for the arrow. If you want to change color go to th eabove website and generate a new gradient. Start with the darkest color. And for the steps value choose the same as below in "gradient_steps"
spring_start_length = 20 // This is the length of the vertical lines of the spring.
arrow_color = "#ffccff" //color of arrows
spring_color = "red" // color of spring itself
weight_color = "blue" // color of weight below spring
arrow_sum_stroke = 10 // Sum arrow stroke width
arrow_stroke = 5 // Force arrows stroke width
spring_stroke = 3
var gradient_steps_spring_fig = 255 //We need this many values if we generate the gradient list!
var grad_arrow_sum = ["#EB70E5", "#EB70E5", "#EB71E5", "#EB71E5", "#EB72E5", "#EB72E5", "#EB73E5", "#EB73E5", "#EB74E5", "#EB75E5    ", "#EB75E6", "#EB76E6", "#EB76E6", "#EC77E6", "#EC77E6", "#EC78E6", "#EC79E6", "#EC79E6", "#EC7AE6", "#EC7AE6", "#EC7BE7", "#EC7    BE7", "#EC7CE7", "#EC7CE7", "#EC7DE7", "#EC7EE7", "#ED7EE7", "#ED7FE7", "#ED7FE7", "#ED80E7", "#ED80E8", "#ED81E8", "#ED82E8", "#    ED82E8", "#ED83E8", "#ED83E8", "#ED84E8", "#ED84E8", "#ED85E8", "#EE85E8", "#EE86E9", "#EE87E9", "#EE87E9", "#EE88E9", "#EE88E9",     "#EE89E9", "#EE89E9", "#EE8AE9", "#EE8BE9", "#EE8BEA", "#EE8CEA", "#EF8CEA", "#EF8DEA", "#EF8DEA", "#EF8EEA", "#EF8EEA", "#EF8FE    A", "#EF90EA", "#EF90EA", "#EF91EB", "#EF91EB", "#EF92EB", "#EF92EB", "#EF93EB", "#F094EB", "#F094EB", "#F095EB", "#F095EB", "#F0    96EB", "#F096EC", "#F097EC", "#F097EC", "#F098EC", "#F099EC", "#F099EC", "#F09AEC", "#F09AEC", "#F19BEC", "#F19BEC", "#F19CED", "    #F19DED", "#F19DED", "#F19EED", "#F19EED", "#F19FED", "#F19FED", "#F1A0ED", "#F1A0ED", "#F1A1EE", "#F2A2EE", "#F2A2EE", "#F2A3EE"    , "#F2A3EE", "#F2A4EE", "#F2A4EE", "#F2A5EE", "#F2A6EE", "#F2A6EE", "#F2A7EF", "#F2A7EF", "#F2A8EF", "#F2A8EF", "#F3A9EF", "#F3A9    EF", "#F3AAEF", "#F3ABEF", "#F3ABEF", "#F3ACEF", "#F3ACF0", "#F3ADF0", "#F3ADF0", "#F3AEF0", "#F3AFF0", "#F3AFF0", "#F3B0F0", "#F    4B0F0", "#F4B1F0", "#F4B1F0", "#F4B2F1", "#F4B2F1", "#F4B3F1", "#F4B4F1", "#F4B4F1", "#F4B5F1", "#F4B5F1", "#F4B6F1", "#F4B6F1",     "#F5B7F2", "#F5B8F2", "#F5B8F2", "#F5B9F2", "#F5B9F2", "#F5BAF2", "#F5BAF2", "#F5BBF2", "#F5BCF2", "#F5BCF2", "#F5BDF3", "#F5BDF3    ", "#F5BEF3", "#F6BEF3", "#F6BFF3", "#F6BFF3", "#F6C0F3", "#F6C1F3", "#F6C1F3", "#F6C2F3", "#F6C2F4", "#F6C3F4", "#F6C3F4", "#F6C    4F4", "#F6C5F4", "#F6C5F4", "#F7C6F4", "#F7C6F4", "#F7C7F4", "#F7C7F4", "#F7C8F5", "#F7C8F5", "#F7C9F5", "#F7CAF5", "#F7CAF5", "#    F7CBF5", "#F7CBF5", "#F7CCF5", "#F7CCF5", "#F8CDF5", "#F8CEF6", "#F8CEF6", "#F8CFF6", "#F8CFF6", "#F8D0F6", "#F8D0F6", "#F8D1F6",     "#F8D1F6", "#F8D2F6", "#F8D3F7", "#F8D3F7", "#F9D4F7", "#F9D4F7", "#F9D5F7", "#F9D5F7", "#F9D6F7", "#F9D7F7", "#F9D7F7", "#F9D8F    7", "#F9D8F8", "#F9D9F8", "#F9D9F8", "#F9DAF8", "#F9DAF8", "#FADBF8", "#FADCF8", "#FADCF8", "#FADDF8", "#FADDF8", "#FADEF9", "#FA    DEF9", "#FADFF9", "#FAE0F9", "#FAE0F9", "#FAE1F9", "#FAE1F9", "#FAE2F9", "#FBE2F9", "#FBE3F9", "#FBE3FA", "#FBE4FA", "#FBE5FA", "    #FBE5FA", "#FBE6FA", "#FBE6FA", "#FBE7FA", "#FBE7FA", "#FBE8FA", "#FBE9FB", "#FCE9FB", "#FCEAFB", "#FCEAFB", "#FCEBFB", "#FCEBFB"    , "#FCECFB", "#FCECFB", "#FCEDFB", "#FCEEFB", "#FCEEFC", "#FCEFFC", "#FCEFFC", "#FCF0FC", "#FDF0FC", "#FDF1FC", "#FDF2FC", "#FDF2    FC", "#FDF3FC", "#FDF3FC", "#FDF4FD", "#FDF4FD", "#FDF5FD", "#FDF5FD", "#FDF6FD", "#FDF7FD", "#FDF7FD", "#FEF8FD", "#FEF8FD", "#F    EF9FD", "#FEF9FE", "#FEFAFE", "#FEFBFE", "#FEFBFE", "#FEFCFE", "#FEFCFE", "#FEFDFE", "#FEFDFE", "#FEFEFE", "#FFFFFF"]



// Trainable RBM Figure
var RBM_node_radius = 10.0


