(function () {
  $('#ta').summernote();

  $('.confirmDeletion').on('click', () => {
    if (!confirm('Confirm Deletion'))
      return false;
  });
}());
