// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
	// One way of distinguishing between different types of messages sent from
	// your HTML page is to use an object with a "type" property like this.
	if (msg.type === "create-rectangles") {
		const nodes: SceneNode[] = [];
		// for (let i = 0; i < msg.size; i++) {
		// 	const rect = figma.createRectangle();
		// 	rect.x = i * 150;
		// 	// rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
		// 	rect.fills = [figma.util.solidPaint(msg.hex)];
		// 	figma.currentPage.appendChild(rect);
		// 	nodes.push(rect);
		// }

		// Create the rectangle
		const rect = figma.createRectangle();
		rect.x = figma.viewport.center.x;
		rect.y = figma.viewport.center.y;
		rect.resize(msg.size, msg.ratio);

		// Put in array and zoom to it
		nodes.push(rect);
		figma.currentPage.selection = nodes;
		figma.viewport.scrollAndZoomIntoView(nodes);
	}
	if (msg.type === "rasterise") {
		const frame = figma.currentPage.selection[0];

		if (frame && frame.type === "FRAME") {
			const newImageLayer = figma.createRectangle();

			// Copy relevant styles and properties
			newImageLayer.resize(frame.width, frame.height);
			newImageLayer.x = frame.x;
			newImageLayer.y = frame.y;
			newImageLayer.fills = frame.fills; // Copy background color, etc.

			// Copy children (layers) from the original frame to the new image layer
			frame.children.forEach((child) => {
				const childClone = child.clone();
				// newImageLayer.appendChild(childClone);
			});

			// Optional: Remove the original frame
			frame.remove();

			figma.currentPage.appendChild(newImageLayer);
			figma.viewport.scrollAndZoomIntoView([newImageLayer]);
		}
	}
	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	// figma.closePlugin();
};
