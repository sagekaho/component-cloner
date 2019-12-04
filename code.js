/*
Component Cloner by Kate Miller (github: katekaho)

Allows users to create a clone of component instances under a new master component

Usage: Select the existing component instances of a master component you would like to clone.
Then hit clone to create a new master component with the instances you selected attached to it

*/
figma.showUI(__html__);
let updateUIIntervalId = setInterval(() => {
    updateUI(figma.currentPage.selection);
}, 500);
// Run on input from ui.html
figma.ui.onmessage = (message) => {
    switch (message.type) {
        case 'cancel':
            figma.closePlugin();
            break;
        case 'clone':
            clearInterval(updateUIIntervalId);
            cloneNodes(figma.currentPage.selection);
            break;
    }
};
/*-----------------------------------------------------------------------------
HELPER FUNCTIONS
-----------------------------------------------------------------------------*/
function updateUI(currentPageSelection) {
    let errorMsg = verifyUserInput(currentPageSelection);
    if (typeof errorMsg !== 'undefined') {
        figma.ui.postMessage({ type: 'inputError', message: errorMsg });
    }
    else {
        let componentFound = false;
        let component;
        let instances = [];
        for (const node of currentPageSelection) {
            let props = { name: node.name, id: node.id };
            if (node.type === 'COMPONENT') {
                componentFound = true;
                component = props;
            }
            else {
                instances.push(props);
            }
        }
        if (!componentFound) {
            let master = currentPageSelection[0].masterComponent;
            component = { name: master.name, id: master.id };
        }
        figma.ui.postMessage({ type: 'noErrors', component, instances });
    }
}
// Verify that child instances and/or the parent of the instances are selected
function verifyUserInput(currentPageSelection) {
    let originalComponent;
    let originalComponentFound = false;
    let originalComponentInSelection = false;
    if (currentPageSelection.length < 1) {
        return ' ';
    }
    // Find the master component, if it has been selected
    for (const currentNode of currentPageSelection) {
        if (currentNode.type == 'COMPONENT') {
            if (originalComponentFound) {
                return 'Selected more than one master component';
            }
            originalComponentFound = true;
            originalComponentInSelection = true;
            originalComponent = currentNode;
            if (currentPageSelection.length == 1) {
                return;
            }
        }
    }
    // Verify user selection of component instances under same master
    for (const currentNode of currentPageSelection) {
        // If master component, skip this iteration
        if (originalComponentInSelection && currentNode.type == 'COMPONENT') {
            continue;
        }
        // Ensure that the each node is of type instance, exit if not
        if (currentNode.type != 'INSTANCE') {
            if (originalComponentInSelection) {
                return 'Selected items are not all instances of the selected master component';
            }
            else {
                return 'Selected items are not all instances of a master component';
            }
        }
        // Ensure that each selected element has the same master
        if (originalComponent == null) {
            // Sets the master component on the first loop
            if (!originalComponentFound) {
                originalComponent = currentNode.masterComponent;
                originalComponentFound = true;
            }
            else {
                return 'Unable to find a master component, please modify your selection';
            }
        }
        else {
            // Check that nodes have the same master
            if (originalComponent !== currentNode.masterComponent) {
                return 'Selected items are instances of different master components';
            }
        }
    }
}
function cloneNodeBasedOnType(copy, original) {
    // console.log(original);
    switch (original.type) {
        case 'SLICE':
            copySliceNode(copy, original);
            break;
        case 'FRAME':
        case 'GROUP':
            copyFrameNode(copy, original);
            break;
        case 'INSTANCE':
            copyInstanceNode(copy, original);
            break;
        case 'BOOLEAN_OPERATION':
            copyBooleanOperationNode(copy, original);
            break;
        case 'VECTOR':
            copyVectorNode(copy, original);
            break;
        case 'STAR':
            copyStarNode(copy, original);
            break;
        case 'LINE':
            copyLineNode(copy, original);
            break;
        case 'ELLIPSE':
            copyEllipseNode(copy, original);
            break;
        case 'POLYGON':
            copyPolygonNode(copy, original);
            break;
        case 'RECTANGLE':
            copyRectangleNode(copy, original);
            break;
        case 'TEXT':
            copyTextNode(copy, original);
            break;
        default:
            console.error('Some other node type, need to add functionality');
    }
}
function cloneNodes(currentPageSelection) {
    let newMasterComponent;
    let newInstanceNodes = [];
    let masterAssigned = false;
    let clonedNodeXYOffset = 40; // Determines how far the nodes move from the original (x and y)
    for (const node of currentPageSelection) {
        // If haven't found the master component yet, assign it and clone
        if (!masterAssigned) {
            if (node.type == 'COMPONENT') { // If master component is first selected, clone it
                newMasterComponent = node.clone();
            }
            else { // Clone the first instance it finds
                newMasterComponent = node.masterComponent.clone();
            }
            newMasterComponent['x'] = newMasterComponent['x'] + clonedNodeXYOffset;
            newMasterComponent['y'] = newMasterComponent['y'] + clonedNodeXYOffset;
            masterAssigned = true;
        }
        if (node.type == 'INSTANCE') {
            // Make a new instance of the original node where the copied data will lay
            let originalInstanceNode = node; // Suppress some type errors
            let instanceNodeCopy = originalInstanceNode.clone();
            // Set the master of the new instance to the newly created one
            instanceNodeCopy.masterComponent = newMasterComponent;
            // Copies all the original data of the node into the new one
            cloneNodeBasedOnType(instanceNodeCopy, originalInstanceNode);
            instanceNodeCopy['x'] = instanceNodeCopy['x'] + clonedNodeXYOffset;
            instanceNodeCopy['y'] = instanceNodeCopy['y'] + clonedNodeXYOffset;
            // Add it to our array so we can select it by default later
            newInstanceNodes.push(instanceNodeCopy);
        }
    }
    // Automatically selects the newly created master and child nodes
    // FUTURE: Move the master near the child nodes by default
    figma.currentPage.selection = [newMasterComponent, ...newInstanceNodes];
    // Display message of completion
    figma.ui.postMessage({ type: 'complete' });
    // Set viewport to cloned nodes
    figma.viewport.scrollAndZoomIntoView(figma.currentPage.selection);
    // Close plugin after 1 second
    // setTimeout(() => figma.closePlugin(), 900);
}
/*-----------------------------------------------------------------------------
END OF HELPER FUNCTIONS
-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------
NODE COPYING FUNCTIONS
-------------------------------------------------------------------------------
The following are helper functions that copy different Node types needed for
this plugin from the original instances

Commented out fields means they can't be copied since they are instances
-----------------------------------------------------------------------------*/
function copyFrameNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['backgroundStyleId'] = original['backgroundStyleId'];
    copy['backgrounds'] = original['backgrounds'];
    copy['blendMode'] = original['blendMode'];
    copy['clipsContent'] = original['clipsContent'];
    // copy['constraints'] = original['constraints'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['gridStyleId'] = original['gridStyleId'];
    copy['guides'] = original['guides'];
    copy['layoutGrids'] = original['layoutGrids'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['parent'] = original['parent'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    // Copy each child
    let currentChild = 0;
    original['children'].forEach(childNode => {
        cloneNodeBasedOnType(copy['children'][currentChild++], childNode);
    });
}
function copyVectorNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    if (original['cornerRadius'] !== figma.mixed) {
        copy['cornerRadius'] = original['cornerRadius'];
    }
    copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['handleMirroring'] = original['handleMirroring'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    // If any fields are mixed, don't copy for now
    if (original['strokeCap'] !== figma.mixed) {
        copy['strokeCap'] = original['strokeCap'];
    }
    if (original['strokeJoin'] !== figma.mixed) {
        copy['strokeJoin'] = original['strokeJoin'];
    }
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    // copy['vectorNetwork'] = original['vectorNetwork'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyBooleanOperationNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['backgrounds'] = original['backgrounds'];
    copy['blendMode'] = original['blendMode'];
    copy['booleanOperation'] = original['booleanOperation'];
    // copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    // Copy each child
    let currentChild = 0;
    original['children'].forEach(childNode => {
        cloneNodeBasedOnType(copy['children'][currentChild++], childNode);
    });
    return;
}
function copyStarNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    copy['cornerRadius'] = original['cornerRadius'];
    copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['innerRadius'] = original['innerRadius'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['pointCount'] = original['pointCount'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyLineNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyEllipseNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    // copy['arcData'] = original['arcData'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyPolygonNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyRectangleNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    // copy['backgrounds'] = original['backgrounds'];
    copy['blendMode'] = original['blendMode'];
    // copy['bottomLeftRadius'] = original['bottomLeftRadius'];
    // copy['bottomRightRadius'] = original['bottomRightRadius'];
    // copy['constraints'] = original['constraints'];
    if (original['cornerRadius'] !== figma.mixed) {
        copy['cornerRadius'] = original['cornerRadius'];
    }
    if (original['cornerSmoothing'] !== figma.mixed) {
        copy['cornerSmoothing'] = original['cornerSmoothing'];
    }
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    return;
}
function copyTextNode(copy, original) {
    // Doesn't support Advanced Type Features, Numbers
    // Load original and new font then modify once complete
    if (original['fontName'] !== figma.mixed) {
        Promise.all([figma.loadFontAsync(copy['fontName']), figma.loadFontAsync(original['fontName'])])
            .then(() => {
            copy['characters'] = original['characters'];
            if (original['fontName'] !== figma.mixed) {
                copy['fontName'] = original['fontName'];
            }
            if (original['fontSize'] !== figma.mixed) {
                copy['fontSize'] = original['fontSize'];
            }
            if (original['letterSpacing'] !== figma.mixed) {
                copy['letterSpacing'] = original['letterSpacing'];
            }
            if (original['lineHeight'] !== figma.mixed) {
                copy['lineHeight'] = original['lineHeight'];
            }
            copy['paragraphIndent'] = original['paragraphIndent'];
            copy['paragraphSpacing'] = original['paragraphSpacing'];
            copy['textAlignHorizontal'] = original['textAlignHorizontal'];
            copy['textAlignVertical'] = original['textAlignVertical'];
            copy['textAutoResize'] = original['textAutoResize'];
            if (original['textCase'] !== figma.mixed) {
                copy['textCase'] = original['textCase'];
            }
            if (original['textDecoration'] !== figma.mixed) {
                copy['textDecoration'] = original['textDecoration'];
            }
            if (original['textStyleId'] !== figma.mixed) {
                copy['textStyleId'] = original['textStyleId'];
            }
        }).catch((err) => {
            console.error("Clone plugin error: function copyTextNode() error: promise failed");
            console.error(err);
        });
    }
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['autoRename'] = original['autoRename'];
    copy['blendMode'] = original['blendMode'];
    // copy['constraints'] = original['constraints'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    if (original['fillStyleId'] !== figma.mixed) {
        copy['fillStyleId'] = original['fillStyleId'];
    }
    if (original['fills'] !== figma.mixed) {
        copy['fills'] = original['fills'];
    }
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['parent'] = original['parent'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['strokeAlign'] = original['strokeAlign'];
    copy['strokeCap'] = original['strokeCap'];
    copy['strokeJoin'] = original['strokeJoin'];
    copy['strokeStyleId'] = original['strokeStyleId'];
    copy['strokeWeight'] = original['strokeWeight'];
    copy['strokes'] = original['strokes'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    return;
}
function copySliceNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    // copy['constraints'] = original['constraints'];
    copy['exportSettings'] = original['exportSettings'];
    // copy['height'] = original['height'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    return;
}
function copyInstanceNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['backgroundStyleId'] = original['backgroundStyleId'];
    copy['backgrounds'] = original['backgrounds'];
    copy['blendMode'] = original['blendMode'];
    copy['clipsContent'] = original['clipsContent'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects'];
    copy['exportSettings'] = original['exportSettings'];
    copy['gridStyleId'] = original['gridStyleId'];
    copy['guides'] = original['guides'];
    // copy['height'] = original['height'];
    // copy['isMask'] = original['isMask'];
    copy['layoutGrids'] = original['layoutGrids'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['parent'] = original['parent'];
    // copy['relativeTransform'] = original['relativeTransform']; // This varies by base or child
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    // Copy each child
    let currentChild = 0;
    original['children'].forEach(childNode => {
        cloneNodeBasedOnType(copy['children'][currentChild++], childNode);
    });
    return;
}
/*-----------------------------------------------------------------------------
END OF NODE COPYING FUNCTIONS
-----------------------------------------------------------------------------*/ 
