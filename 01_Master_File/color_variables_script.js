
// COLORS FIGURE 1 (Temperature, coupling and probability)
var 	c_histo_bars = "blue" 			//Color of the histogram bars
	c_hid_node1 = "rgb(0,0,255,0.5)" 	// Color1 hidden node
	c_hid_node2 = "rgb(255,0,0,0.5)" 	// Color2 hidden node
	c_hid_node1_stroke = "blue" 		// Stroke color1 hidden node
	c_hid_node2_stroke = "red" 		// Storke color2 hidden node
	c1_2D_slider = "white" 			// Slider background color1 (2 COLORS BECAUSE IT IS A GRADIENT)
	c2_2D_slider = "grey" 			// Slider background color2
	c_handle_2D_slider = "orange" 		// SLider Handle color
	c_stroke_2D_slider = "white" 		// Slider lines color
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
            stroke_energy_line = 3.0
