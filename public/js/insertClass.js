(function ($) {
	"use strict";

	//datatables
	let studentsTable = $('#studentsTable').DataTable({
		'scrollY': 250,
		'paging': false,
		'searching': false,
		'info': false
	});

	let professorsTable = $('#professorsTable').DataTable({
		'scrollY': 250,
		'paging': false,
		'searching': false,
		'info': false
	});

	let usersToInsertListElement = $('#userToAdd');
	let usersToInsertList = []; //list of users to insert
	let selectedUser;

	let subjectSelector = $('#materia');
	subjectSelector.prop("disabled", true);

	//TODO aggiungere tutte le materie, decidendo i valori
	let subjectMapping = {
		0: 'Matematica',
		1: 'Storia',
		2: 'Italiano',
		3: 'Inglese',
		4: 'Informatica'
	}

	//add all subjects
	for (let key in subjectMapping) {
		subjectSelector.append($('<option>').val(key).text(subjectMapping[key]));
	}

	usersToInsertListElement.on('change', function (e) {
		let selectedUserElem = $(this).find('option:selected');
		//reset subject field
		subjectSelector.find('option:selected').prop('selected', false);
		subjectSelector.find('option[value=""]').prop('selected', true);
		if (selectedUserElem.val() !== '') {
			//retreive selected user data
			selectedUser = usersToInsertList[selectedUserElem.val()];
			if (selectedUser.role === 1) {
				subjectSelector.prop("disabled", false);
			} else {
				subjectSelector.prop("disabled", true);
			}
		} else {
			subjectSelector.prop("disabled", true);
		}
	});

	function getUsersToInsert() {
		fetch('../api/v1/users')
			.then(resp => resp.json())
			.then((data) => {
				data.map((elem) => {
					//TODO prendere solo quelli senza classe assegnata (e comunque i professori) da query forse è meglio
					if ((!elem.class_id && elem.role === 0) || elem.role === 1) {
						usersToInsertListElement.append($('<option>').val(elem._id).text(elem.name + " " + elem.surname));
						usersToInsertList[elem._id] = elem;
					}
				});
			})
	}

	$('#aggiungi').on('click', function (e) {
		let selectedUserElem = usersToInsertListElement.find('option:selected');
		if (selectedUserElem.val() !== '') {
			selectedUser = usersToInsertList[selectedUserElem.val()];
			if (selectedUser.role === 1) {
				let subject = subjectSelector.find('option:selected').val();
				if (subject !== '') {
					addTeacher(selectedUser, subject);
				}
			} else {
				addStudent(selectedUser);
			}
		}
	});

	function addTeacher(user, subject) {
		//TODO controllo che non sia già inserito (array)
		//add to teacher table
		professorsTable.row.add([
			user.name,
			user.surname,
			subjectMapping[subject],
			'<button type="button" class="btn btn-danger removeProfessor">Rimuovi</button>'
		]).draw().node().id = user._id;

		//remove selection
		subjectSelector.find('option:selected').prop('selected', false);
		subjectSelector.find('option[value=""]').prop('selected', true);
	}

	function addStudent(user) {
		//TODO controllo che non sia già inserito (array)
		//add to student table
		studentsTable.row.add([
			user.name,
			user.surname,
			'<button type="button" class="btn btn-danger removeStudent">Rimuovi</button>'
		]).draw().node().id = user._id;

		//remove selection
		usersToInsertListElement.find('option:selected').prop('selected', false);
		usersToInsertListElement.find('option[value=""]').prop('selected', true);
		subjectSelector.find('option:selected').prop('selected', false);
		subjectSelector.find('option[value=""]').prop('selected', true);
		subjectSelector.prop("disabled", true);
	}

	//event attached to the table, but executed by buttons with class .removeProfessor
	$('#professorsTable').on('click', 'button.removeProfessor', function (e) {
		let toRemove = $(this).closest('tr');
		let idToRemove = toRemove.id;

		//TODO rimuovo da array
		
		professorsTable.row(toRemove).remove().draw(false);
	});

	$('#studentsTable').on('click', 'button.removeStudent', function (e) {
		let toRemove = $(this).closest('tr');
		let idToRemove = toRemove.id;

		//TODO rimuovo da array
		
		studentsTable.row(toRemove).remove().draw(false);
	});

	getUsersToInsert();

})(jQuery);