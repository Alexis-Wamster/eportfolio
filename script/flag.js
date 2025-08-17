const flagLists = Array.from(document.querySelectorAll('.flag-list'));
const flags = flagLists.map(list => Array.from(list.querySelectorAll('.flag')));
const projects = document.querySelectorAll('.project-card');

    flags.forEach(flagList => {
        flagList.forEach(flag => {
            flag.addEventListener('click', () => {
                // Toggle the selected class
                flag.classList.toggle('selected');

                // Update project visibility
                updateProjectsVisibility();
            });
        });
    });

    function updateProjectsVisibility() {
        // Get selected flags per flaglist
        const selectedFlagsPerList = flags.map(flagList =>
            flagList.filter(flag => flag.classList.contains('selected')).map(flag => flag.dataset.flag)
        );

        projects.forEach(project => {
            const projectFlags = project.dataset.flags.split(' ');
            // Check that for each flaglist, at least one selected flag is present in projectFlags
            const isVisible = selectedFlagsPerList.every(selectedFlags =>
                selectedFlags.length === 0 || selectedFlags.some(flag => projectFlags.includes(flag))
            );

            if (isVisible) {
                project.classList.remove('hidden');
            } else {
                project.classList.add('hidden');
            }
        });
    }

// Initial call to set visibility
updateProjectsVisibility();