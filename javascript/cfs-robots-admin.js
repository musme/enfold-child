const init = () => {
	const refreshLabels = (wrapper) => {
		const textElements = wrapper.querySelectorAll('.cfs_text input');
		const textAreaElement = wrapper.querySelector('.cfs_textarea textarea');
		const selectedPost = wrapper.querySelector('.selected_posts div');
		const label = wrapper.querySelector('.cfs_loop_head .label');

		let title = label.textContent;
		if (selectedPost) {
			title = selectedPost.textContent;
		} else if (textElements.length) {
			title = textElements[0].value + ' - ' + textElements[1].value + '%';
		} else if (textAreaElement) {
			title = textAreaElement.value;
		}

		label.innerHTML = title;
	};

	const loops = document.querySelectorAll('.field-calc_robots .cfs_loop');
	if (loops.length) {
		loops.forEach((loop) => {
			const wrappers = loop.querySelectorAll('.loop_wrapper');
			wrappers.forEach((wrapper) => {
				const textElement = wrapper.querySelector('.cfs_text');
				const textAreaElement = wrapper.querySelector('.cfs_textarea');
				const selectedPost = wrapper.querySelector(
					'.selected_posts div'
				);

				if (textElement || textAreaElement || selectedPost) {
					refreshLabels(wrapper);
				}
			});
		});
	}

	const triggers = document.querySelectorAll(
		'.field-calc_robots .cfs_loop input[type="text"]'
	);
	triggers.forEach((trigger) => {
		trigger.addEventListener('change', () => {
			refreshLabels(trigger.closest('.loop_wrapper'));
		});
		trigger.addEventListener('keyup', () => {
			refreshLabels(trigger.closest('.loop_wrapper'));
		});
		trigger.addEventListener('paste', () => {
			refreshLabels(trigger.closest('.loop_wrapper'));
		});
	});
};

export default init;
