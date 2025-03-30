document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('account_password');
    const helpBox = document.getElementById('passwordHelp');
  
    if (passwordInput && helpBox) {
      passwordInput.addEventListener('focus', () => {
        helpBox.style.display = 'block';
      });
  
      passwordInput.addEventListener('blur', () => {
        helpBox.style.display = 'none';
      });
    }
  });