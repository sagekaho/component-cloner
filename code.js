/*
Clone Master by Kate Miller (github: katekaho)

Allows users to create a clone of component instances under a new master

Usage: Select the existing component instances of a master component and run the plugin
This will create a new master component with the instances you selected attached to it

To-do:

Close plugin once last text field has been added DONE
Test each shape
Test vector node/redo it
Add support for nested nodes, groups in particular DONE
Put master component on same page or nearby if it's too far away from current
Option to select master component to clone along with its child components

Questions?
Why can't I modify height

Observation:
Instance nodes can't be nested - thank goodness
Prototyping stuff is not considered at all, maybe test it later

*/
/*-----------------------------------------------------------------------------
NODE COPYING FUNCTIONS
-------------------------------------------------------------------------------
The following are helper function that copy different Node types needed for this
application from the original instances
-----------------------------------------------------------------------------*/
// Also includes group, which needs to be recursive or iterative through children
function copyFrameNode(copy, original) {
    // console.log(original);
    // console.log(original);
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['backgrounds'] = original['backgrounds'];
    copy['backgroundStyleId'] = original['backgroundStyleId'];
    copy['blendMode'] = original['blendMode'];
    // copy['children'] = original['children'];
    copy['clipsContent'] = original['clipsContent'];
    copy['constraints'] = original['constraints'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
    copy['exportSettings'] = original['exportSettings'];
    copy['gridStyleId'] = original['gridStyleId'];
    copy['guides'] = original['guides'];
    copy['layoutGrids'] = original['layoutGrids'];
    copy['locked'] = original['locked'];
    copy['name'] = original['name'];
    copy['opacity'] = original['opacity'];
    // copy['relativeTransform'] = original['relativeTransform'];
    // copy['removed'] = original['removed'];
    // copy['rotation'] = original['rotation'];
    // copy['type'] = original['type'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
    // Copy each child
    var currentChild = 0;
    original['children'].forEach(function (childNode) {
        console.log(childNode);
        copyNodesBasedOnType(copy['children'][currentChild++], childNode);
    });
}
function copyVectorNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    copy['constraints'] = original['constraints'];
    copy['cornerRadius'] = original['cornerRadius'];
    copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
    copy['exportSettings'] = original['exportSettings'];
    copy['fillStyleId'] = original['fillStyleId'];
    copy['fills'] = original['fills'];
    copy['handleMirroring'] = original['handleMirroring'];
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
    copy['vectorNetwork'] = original['vectorNetwork'];
    copy['visible'] = original['visible'];
    // copy['width'] = original['width'];
    // copy['x'] = original['x'];
    // copy['y'] = original['y'];
}
function copyBooleanOperationNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    // copy['backgrounds'] = original['backgrounds'];
    copy['blendMode'] = original['blendMode'];
    copy['booleanOperation'] = original['booleanOperation'];
    // copy['children'] = original['children'];
    copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
function copyStarNode(copy, original) {
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['blendMode'] = original['blendMode'];
    copy['constraints'] = original['constraints'];
    copy['cornerRadius'] = original['cornerRadius'];
    copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
    copy['constraints'] = original['constraints'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
    copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
    copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
    copy['constraints'] = original['constraints'];
    // copy['cornerRadius'] = original['cornerRadius'];
    // copy['cornerSmoothing'] = original['cornerSmoothing'];
    copy['dashPattern'] = original['dashPattern'];
    copy['effectStyleId'] = original['effectStyleId'];
    copy['effects'] = original['effects']; // might be problem
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
    Promise.all([figma.loadFontAsync(copy['fontName']), figma.loadFontAsync(original['fontName'])])
        .then(function () {
        copy['characters'] = original['characters'];
        copy['fontName'] = original['fontName'];
        copy['fontSize'] = original['fontSize'];
        copy['letterSpacing'] = original['letterSpacing'];
        copy['lineHeight'] = original['lineHeight'];
        copy['paragraphIndent'] = original['paragraphIndent'];
        copy['paragraphSpacing'] = original['paragraphSpacing'];
        copy['textAlignHorizontal'] = original['textAlignHorizontal'];
        copy['textAlignVertical'] = original['textAlignVertical'];
        copy['textAutoResize'] = original['textAutoResize'];
        copy['textCase'] = original['textCase'];
        copy['textDecoration'] = original['textDecoration'];
        copy['textStyleId'] = original['textStyleId'];
    })["catch"](function (err) {
        console.log("function copyTextNode() error: promise failed");
        console.log(err);
    });
    // copy['absoluteTransform'] = original['absoluteTransform'];
    copy['autoRename'] = original['autoRename'];
    copy['blendMode'] = original['blendMode'];
    copy['constraints'] = original['constraints'];
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
    copy['constraints'] = original['constraints'];
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
    return;
}
/*-----------------------------------------------------------------------------
END OF NODE COPYING FUNCTIONS
-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------
OTHER HELPER FUNCTIONS
-----------------------------------------------------------------------------*/
// Prints the error and exits plugin
function selectionError(errorMsg) {
    console.log(errorMsg);
    figma.closePlugin();
}
function verifyUserInput(currentPageSelection) {
    var currentInstanceNode;
    // If nothing selected, exit
    if (currentPageSelection.length < 1) {
        selectionError('Nothing currently selected by user on this page');
    }
    // Verify user selection of component instances under same master
    for (var _i = 0, currentPageSelection_1 = currentPageSelection; _i < currentPageSelection_1.length; _i++) {
        var currentNode = currentPageSelection_1[_i];
        // Ensure that the each node is of type instance, exit if not
        if (currentNode.type != 'INSTANCE') {
            selectionError('Selected nodes are not component instances');
        }
        // Specify the node type so no other errors occur
        currentInstanceNode = currentNode;
        // Ensure that each selected element has the same master
        if (originalMasterComponent == null) {
            // Sets the master component on the first loop
            if (!masterComponentFound) {
                originalMasterComponent = currentInstanceNode.masterComponent;
                masterComponentFound = true;
            }
            else {
                selectionError('Error: master was not assigned on first iteration');
            }
        }
        else {
            // Check that nodes have the same master
            if (originalMasterComponent !== currentInstanceNode.masterComponent) {
                selectionError('Selected nodes have different master components');
            }
        }
    }
}
function copyNodesBasedOnType(copy, original) {
    console.log(original.type);
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
            console.log('Some other node type, need to add functionality');
    }
}
/*-----------------------------------------------------------------------------
END OF EXTRA HELPER FUNCTIONS
-----------------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------
START OF MAIN PLUGIN CODE
-----------------------------------------------------------------------------*/
// Global variables
var originalMasterComponent; // Master component to clone
var newMasterComponent; // Copy of the original master component
var currentInstanceNode; // Current node in loop, used to suppress errors
var newChildNodes = []; // Holds all newly cloned child instances
var masterComponentFound = false;
// Verifies that users selected the right thing, needs refactoring after UI
verifyUserInput(figma.currentPage.selection);
newMasterComponent = originalMasterComponent.clone();
// Loop through the selected components
for (var _i = 0, _a = figma.currentPage.selection; _i < _a.length; _i++) {
    var node = _a[_i];
    // Specify the node type so no other errors occur
    var instanceNode = node;
    // Create another instance of the node you want
    var newChild = instanceNode.clone();
    // Set the master of the new instance to the new one
    newChild.masterComponent = newMasterComponent;
    // Copies the base instance node information, without considering its children
    copyInstanceNode(newChild, instanceNode);
    // Iterates and copies base instance children information
    for (var k = 0; k < instanceNode.children.length; k++) {
        copyNodesBasedOnType(newChild.children[k], instanceNode.children[k]);
    }
    newChildNodes.push(newChild);
}
// Automatically selects the newly created master and child nodes
// FUTURE: Move the master near the child nodes by default
figma.currentPage.selection = [newMasterComponent].concat(newChildNodes);
// Make sure to close the plugin when you're done. Otherwise the plugin will
// keep running, which shows the cancel button at the bottom of the screen.
figma.closePlugin();
