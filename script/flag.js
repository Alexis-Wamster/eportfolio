const flags = document.querySelectorAll('.flag');
const projects = document.querySelectorAll('.project-card');

    flags.forEach(flag => {
        flag.addEventListener('click', () => {
            // Toggle the selected class
            flag.classList.toggle('selected');

            // Update project visibility
            updateProjectsVisibility();
        });
    });

    function updateProjectsVisibility() {
        // Get all selected flags
        const selectedFlags = Array.from(flags)
            .filter(flag => flag.classList.contains('selected'))
            .map(flag => flag.dataset.flag);

        // Show or hide projects based on flags
        projects.forEach(project => {
            const projectFlags = project.dataset.flags.split(' ');
            const isVisible = projectFlags.some(flag => selectedFlags.includes(flag));

            if (isVisible) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
    }

// Initial call to set visibility
updateProjectsVisibility();