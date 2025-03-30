document.addEventListener('DOMContentLoaded', () => {

/* ****************************************
*  Password Help Box
* *************************************** */
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

/* ****************************************
*  Show password
* *************************************** */

    const togglePassword = document.getElementById('togglePassword');

    togglePassword.addEventListener('change', function () {
    passwordInput.type = this.checked ? 'text' : 'password';
    });
  });

  