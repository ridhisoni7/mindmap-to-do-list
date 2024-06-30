let tasks = []; // Array to store tasks
let currentTask = null; // Variable to keep track of the currently moving task
let isDragging = false; // Flag to indicate if we're currently dragging
let isResizing = false; // Flag to indicate if we're currently resizing
let isLinking = false; // Flag to indicate if we're currently linking tasks
let startTask = null; // Starting task for linking
let links = []; // Array to store links between tasks

function createTask(x, y) {
    // Create a div container for the task
    let taskContainer = document.createElement('div');
    taskContainer.className = 'task-container';
    taskContainer.style.position = 'absolute';
    taskContainer.style.left = x + 'px';
    taskContainer.style.top = y + 'px';

    // Create a textarea element
    let task = document.createElement('textarea');
    task.className = 'task';
    task.placeholder = 'New Task';
    task.style.resize = 'horizontal';
    task.style.overflow = 'hidden';
    task.style.boxSizing = 'border-box';
    task.style.width = '200px';
    task.style.minHeight = '50px';
    
    // Append textarea to the container
    taskContainer.appendChild(task);

    // Append task container to the app container
    document.getElementById('app').appendChild(taskContainer);
    tasks.push(taskContainer);

    // Adjust height based on content
    task.addEventListener('input', adjustHeight);
    adjustHeight({ target: task });

    let offsetX, offsetY;

    taskContainer.addEventListener('mousedown', function(event) {
        if (!isResizing) {
            if (event.ctrlKey) {
                // Start linking if Ctrl key is pressed
                if (!isLinking) {
                    startTask = taskContainer;
                    isLinking = true;
                } else {
                    createLink(startTask, taskContainer);
                    isLinking = false;
                    startTask = null;
                }
            } else if (event.button === 0) { // Left mouse button
                isDragging = true;
                currentTask = taskContainer;
                offsetX = event.clientX - taskContainer.getBoundingClientRect().left;
                offsetY = event.clientY - taskContainer.getBoundingClientRect().top;

                document.addEventListener('mousemove', moveTask);
                document.addEventListener('mouseup', stopMoving);
            }
        }
    });

    task.addEventListener('mousemove', function(event) {
        const rect = task.getBoundingClientRect();
        const rightEdge = rect.right - event.clientX;
        
        if (rightEdge < 10) {
            task.style.cursor = 'ew-resize';
            isResizing = true;
        } else {
            task.style.cursor = 'text';
            isResizing = false;
        }
    });

    // Add contextmenu event listener for right-click to the container
    taskContainer.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent the default context menu
        toggleTaskCompletion(taskContainer);
    });

    function moveTask(event) {
        if (isDragging) {
            currentTask.style.left = (event.clientX - offsetX) + 'px';
            currentTask.style.top = (event.clientY - offsetY) + 'px';
            updateLinks();
        }
    }

    function stopMoving(event) {
        isDragging = false;
        document.removeEventListener('mousemove', moveTask);
        document.removeEventListener('mouseup', stopMoving);
    }

    // Prevent the textarea from capturing the click event when we're trying to create a new task
    task.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    // Add keydown event listener to handle Enter key press and Delete key press
    task.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default behavior (new line)
            task.blur(); // Unfocus the textarea
        } else if (event.key === 'Delete') {
            event.preventDefault();
            removeTask(taskContainer);
        }
    });
}

// function createTask(x, y) {
//     // Create a textarea element
//     let task = document.createElement('textarea');
//     task.className = 'task';
//     task.style.left = x + 'px';
//     task.style.top = y + 'px';
//     task.placeholder = 'New Task';
//     task.style.resize = 'horizontal'; // Allow only horizontal resizing
//     task.style.overflow = 'hidden'; // Hide scrollbars
//     task.style.boxSizing = 'border-box';
//     task.style.width = '200px'; // Default width
//     task.style.minHeight = '50px'; // Minimum height
//     task.completed = false; // New property to track completion status
    
//     // Append task to the app container
//     document.getElementById('app').appendChild(task);
//     tasks.push(task);

//     // Adjust height based on content
//     task.addEventListener('input', adjustHeight);
//     adjustHeight({ target: task });

//     let offsetX, offsetY;

//     task.addEventListener('mousedown', function(event) {
//         if (event.target === task && !isResizing) {
//             if (event.ctrlKey) {
//                 // Start linking if Ctrl key is pressed
//                 if (!isLinking) {
//                     startTask = task;
//                     isLinking = true;
//                 } else {
//                     createLink(startTask, task);
//                     isLinking = false;
//                     startTask = null;
//                 }
//             } else if (event.button === 0) { // Left mouse button
//                 isDragging = true;
//                 currentTask = task;
//                 offsetX = event.clientX - task.getBoundingClientRect().left;
//                 offsetY = event.clientY - task.getBoundingClientRect().top;

//                 document.addEventListener('mousemove', moveTask);
//                 document.addEventListener('mouseup', stopMoving);
//             }
//         }
//     });

//     task.addEventListener('mousemove', function(event) {
//         if (event.target === task) {
//             const rect = task.getBoundingClientRect();
//             const rightEdge = rect.right - event.clientX;
            
//             if (rightEdge < 10) {
//                 task.style.cursor = 'ew-resize';
//                 isResizing = true;
//             } else {
//                 task.style.cursor = 'move';
//                 isResizing = false;
//             }
//         }
//     });

//     // Add contextmenu event listener for right-click
//     task.addEventListener('contextmenu', function(event) {
//         event.preventDefault(); // Prevent the default context menu
//         toggleTaskCompletion(task);
//     });

//     function moveTask(event) {
//         if (isDragging) {
//             currentTask.style.left = (event.clientX - offsetX) + 'px';
//             currentTask.style.top = (event.clientY - offsetY) + 'px';
//             updateLinks();
//         }
//     }

//     function stopMoving(event) {
//         isDragging = false;
//         document.removeEventListener('mousemove', moveTask);
//         document.removeEventListener('mouseup', stopMoving);
//     }

//     // Prevent the textarea from capturing the click event when we're trying to create a new task
//     task.addEventListener('click', function(event) {
//         event.stopPropagation();
//     });

//     // Add keydown event listener to handle Enter key press and Delete key press
//     task.addEventListener('keydown', function(event) {
//         if (event.key === 'Enter') {
//             event.preventDefault(); // Prevent default behavior (new line)
//             task.blur(); // Unfocus the textarea
//         } else if (event.key === 'Delete') {
//             event.preventDefault();
//             removeTask(task);
//         }
//     });

//     task.addEventListener('contextmenu', function(event) {
//         event.preventDefault(); // Prevent the default context menu
//         toggleTaskCompletion(task);
//     });
// }

// Toggle task completion status
function toggleTaskCompletion(taskContainer) {
    taskContainer.completed = !taskContainer.completed;
    let task = taskContainer.querySelector('.task');
    if (taskContainer.completed) {
        task.style.backgroundColor = '#e0e0e0'; // Light gray background for completed tasks
        task.style.textDecoration = 'line-through';
    } else {
        task.style.backgroundColor = ''; // Reset to default background
        task.style.textDecoration = 'none';
    }
}

// Adjust height of the textarea to fit content
function adjustHeight(event) {
    const element = event.target;
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
}

// Create a link between two tasks
function createLink(task1, task2) {
    const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    link.setAttribute('stroke', 'black');
    link.setAttribute('stroke-width', '2');
    links.push({ line: link, start: task1, end: task2 });
    updateLinkPosition(link, task1, task2);
    getSVGCanvas().appendChild(link);
}

// Update position of all links
function updateLinks() {
    links.forEach(link => {
        updateLinkPosition(link.line, link.start, link.end);
    });
}

// Update position of a single link
function updateLinkPosition(link, task1, task2) {
    const rect1 = task1.getBoundingClientRect();
    const rect2 = task2.getBoundingClientRect();
    link.setAttribute('x1', rect1.left + rect1.width / 2);
    link.setAttribute('y1', rect1.top + rect1.height / 2);
    link.setAttribute('x2', rect2.left + rect2.width / 2);
    link.setAttribute('y2', rect2.top + rect2.height / 2);
}

// Get or create SVG canvas for drawing links
function getSVGCanvas() {
    let svg = document.getElementById('linkCanvas');
    if (!svg) {
        svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.id = 'linkCanvas';
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.pointerEvents = 'none';
        document.getElementById('app').appendChild(svg);
    }
    return svg;
}

// Remove a task and its associated links
function removeTask(task) {
    task.remove();
    tasks = tasks.filter(t => t !== task);
    links = links.filter(link => {
        if (link.start === task || link.end === task) {
            link.line.remove();
            return false;
        }
        return true;
    });
}

// Event listener for clicking on the screen
document.addEventListener('click', function(event) {
    if (!isDragging && !isResizing && !isLinking) {
        createTask(event.clientX, event.clientY);
    }
});