
/**
 * Tech Frontier - メインJavaScript（最終版）
 */

(function() {
  'use strict';

  document.addEventListener("DOMContentLoaded", function () {
    initHamburgerMenu();
    initBackToTop();
    initScrollFadeIn();
    initFormValidation();
  });

  /**
   * ハンバーガーメニュー
   */
  function initHamburgerMenu() {
    const hamburger = document.getElementById("hamburger");
    const nav = document.getElementById("g-nav");
    const links = document.querySelectorAll("#g-nav a");

    if (!hamburger || !nav) return;

    hamburger.addEventListener("click", function() {
      const isActive = hamburger.classList.toggle("active");
      nav.classList.toggle("active");
      hamburger.setAttribute('aria-expanded', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });

    links.forEach(function(link) {
      link.addEventListener("click", function() {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && nav.classList.contains('active')) {
        hamburger.classList.remove("active");
        nav.classList.remove("active");
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  /**
   * トップへ戻るボタン
   */
  function initBackToTop() {
    const backToTop = document.getElementById("backToTop");
    if (!backToTop) return;

    window.addEventListener("scroll", function() {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", function() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /**
   * スクロールフェードイン
   */
  function initScrollFadeIn() {
    const targets = document.querySelectorAll(".fade-in");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    targets.forEach(function(target) {
      observer.observe(target);
    });
  }

  /**
   * フォームバリデーション
   */
  function initFormValidation() {
    const form = document.getElementById('counseling-form');
    if (!form) return;

    const nameInput = document.getElementById('name');
    const furiganaInput = document.getElementById('furigana');
    const emailInput = document.getElementById('email');
    const birthdayInput = document.getElementById('birthday');
    const privacyCheckbox = document.getElementById('privacy');

    const nameError = document.getElementById('name-error');
    const furiganaError = document.getElementById('furigana-error');
    const emailError = document.getElementById('email-error');
    const birthdayError = document.getElementById('birthday-error');
    const privacyError = document.getElementById('privacy-error');

    // リアルタイムバリデーション
    if (nameInput) nameInput.addEventListener('blur', validateName);
    if (furiganaInput) furiganaInput.addEventListener('blur', validateFurigana);
    if (emailInput) emailInput.addEventListener('blur', validateEmail);
    if (birthdayInput) birthdayInput.addEventListener('blur', validateBirthday);

    // フォーム送信
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const isNameValid = validateName();
      const isFuriganaValid = validateFurigana();
      const isEmailValid = validateEmail();
      const isBirthdayValid = validateBirthday();
      const isPrivacyValid = validatePrivacy();

      if (isNameValid && isFuriganaValid && isEmailValid && isBirthdayValid && isPrivacyValid) {
        submitForm();
      } else {
        const firstError = form.querySelector('.error-message:not(:empty)');
        if (firstError) {
          const errorInput = firstError.previousElementSibling;
          if (errorInput) errorInput.focus();
        }
      }
    });

    function validateName() {
      const value = nameInput.value.trim();
      if (value === '') {
        showError(nameInput, nameError, 'お名前を入力してください');
        return false;
      }
      if (value.length < 2) {
        showError(nameInput, nameError, 'お名前は2文字以上で入力してください');
        return false;
      }
      clearError(nameInput, nameError);
      return true;
    }

    function validateFurigana() {
      const value = furiganaInput.value.trim();
      if (value === '') {
        showError(furiganaInput, furiganaError, 'ふりがなを入力してください');
        return false;
      }
      const hiraganaRegex = /^[ぁ-ん\s　]+$/;
      if (!hiraganaRegex.test(value)) {
        showError(furiganaInput, furiganaError, 'ふりがなはひらがなで入力してください');
        return false;
      }
      clearError(furiganaInput, furiganaError);
      return true;
    }

    function validateEmail() {
      const value = emailInput.value.trim();
      if (value === '') {
        showError(emailInput, emailError, 'メールアドレスを入力してください');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(emailInput, emailError, '正しいメールアドレスを入力してください');
        return false;
      }
      clearError(emailInput, emailError);
      return true;
    }

    function validateBirthday() {
      if (!birthdayInput.value) {
        clearError(birthdayInput, birthdayError);
        return true;
      }
      const birthday = new Date(birthdayInput.value);
      const today = new Date();
      if (birthday > today) {
        showError(birthdayInput, birthdayError, '未来の日付は選択できません');
        return false;
      }
      clearError(birthdayInput, birthdayError);
      return true;
    }

    function validatePrivacy() {
      if (!privacyCheckbox.checked) {
        showError(privacyCheckbox, privacyError, 'プライバシーポリシーに同意してください');
        return false;
      }
      clearError(privacyCheckbox, privacyError);
      return true;
    }

    function showError(input, errorElement, message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }

    function clearError(input, errorElement) {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }

    function submitForm() {
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      
      submitButton.disabled = true;
      submitButton.textContent = '送信中...';

      // デモ用の送信処理（実際は以下をサーバー送信に置き換える）
      setTimeout(function() {
        alert('送信が完了しました！\n担当者から折り返しご連絡いたします。');
        form.reset();
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        
        // 実際の実装ではLINE公式アカウントなどにリダイレクト
        // window.location.href = 'https://line.me/R/ti/p/@yourlineaccount';
      }, 1000);
    }
  }

})();
