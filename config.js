module.exports = function () {
  const config = {
    database: {
      dialect: 'sqlite',
      storage: './.data/db.sqlite',
    },
    sync: {
      //force: true,
      //alter: true,
    },
    logdb: false,
    logprefix: '[challenges-server] ',
    port: 3000,
    sessionSecret: 'keyboard cat',
    locale: 'en',
    theme: 'sketchy',
    reloadChallenges: true,
    configRoutes: true,
    challengesDir: process.cwd(),
    staticFolder: './public',
    accounts: {
      minUsername: 3,
      maxUsername: 40,
      minPw: 4,
      maxPw: 100,
      regex: /^[ -~äöüÄÖÜß]+$/,
      maxRatePerHour: 500,
      roomRegex: /^[a-zA-Z0-9]+$/,
      minRoom: 3,
      maxRoom: 20,
      maxRoomPerHour: 50,
      highscoreLimit: 2000,
      topHackersLimit: 10,
      solveRateLimit: 20,
      solveRateTimeout: 30,
    },
    map: {
      background: '/background.jpg',
      backgroundLicenseHtml:
        '<a href="https://paintingvalley.com/sketch-paper-texture#sketch-paper-texture-37.jpg">paintingvalley.com</a> (<a href="https://creativecommons.org/licenses/by-nc/4.0/deed.en">CC BY-NC 4.0</a>)',
      textColor: 'black',
      drawPoint: (link, p, textColor) => {
        link.circle(18).attr({
          fill: p.isSolved ? 'var(--gray-dark)' : 'var(--success)',
          cx: p.pos.x,
          cy: p.pos.y,
        })
        const text = link
          .plain(p.title)
          .fill(textColor)
          .font('family', 'inherit')
        text.center(p.pos.x + p.title.length, p.pos.y - 23)
      },
      drawConnection: (canvas, c) => {
        canvas
          .line(c.start.x, c.start.y, c.end.x, c.end.y)
          .stroke({ width: 10 })
          .stroke('var(--gray)')
          .attr('stroke-linecap', 'round')
      },
    },
    brand: 'challenges-server',
    slogan: 'An homage to hacker.org',
    periodic: {
      startupDelay: 2000,
      baseInterval: 10000,
    },
    session: {
      cleanupInterval: 5, // minutes
      allowUnderexpire: 10, // minutes
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  }

  config.i18n = {
    share: {
      back: 'Back',
      go: 'Go',
    },
    home: {
      loginHeading: 'Login',
      invalid: 'Login failed!',
      name: 'Name:',
      password: 'Password:',
      invite: 'New here? Create a free account and get started:',
      registerLink: 'Register',
      joinRoom: 'Join room',
      hackerOfTheMonth: 'Top 10 of the Month',
      showHighscore: 'Show all',
      rooms: 'Rooms',
      inviteOrga: 'Are you hosting an event? Here you can ',
      createRoom: 'create a custom room',
      contactLink: 'Contact',
      privacyLink: 'Privacy Policy',
      github: 'GitHub',
      version: 'Version: May 2020',
    },
    register: {
      title: 'Register',
      username: 'Username',
      password: 'Password',
      repeatPassword: 'Repeat password',
      usernameNote: `Min. ${config.accounts.minUsername} characters`,
      passwordNote: `Min. ${config.accounts.minPw} characters`,
      noteOn: 'Review our',
      dataProtection: 'privacy policy',
      nameTooShort: 'Username too short.',
      nameTooLong: `Username too long, max. ${config.accounts.maxUsername} characters.`,
      nameInvalidChars: 'Username contains invalid characters.',
      pwTooShort: 'Password too short.',
      pwTooLong: 'Long passwords are good. But this??',
      pwMismatch: "Passwords don't match.",
      invalidToken: 'Form invalid. Please try again.',
      failure: 'Creating user failed. Please try again.',
      nameExists: 'Username already exists.',
      serverCrowded:
        'There are too many registrations at the moment. Please try again in 15 minutes.',
    },
    join: {
      title: 'Join',
      key: 'Room key:',
      roomNotFound: 'Room not found!',
    },
    highscore: {
      title: 'Highscore',
      empty: 'There are no users in the highscore yet. Become the first!',
      rank: 'Rank',
      name: 'Username',
      score: 'Score',
      sessionScore: 'Session Score',
      lastActive: 'Last Active',
      showRoomScore: 'room only',
      showGlobalScore: 'show all',
    },
    create: {
      title: 'Create Room',
      yourRooms: 'My Rooms',
      key: 'New room key:',
      go: 'Create',
      information:
        'You can use a room to create a local highscore for your event and use the session system. A session lasts 30 minutes, in this time users can solve challenges and gain points. After 30 minutes, the score is submitted to the local highscore. After the session, users can continue to work on the challenges as regular users.',
      keyInvalid: 'Only alphanumeric characters allowed in room key.',
      keyTooShort: 'Room key to short.',
      keyTooLong: 'Room key to long.',
      keyExists: 'Room key already exists.',
      failure: 'Creating room failed. Please try again.',
      keyNote: `${config.accounts.minRoom} - ${config.accounts.minRoom} characters, alpha-numeric`,
      serverCrowded:
        'There are too many room creations at the moment. Please try again in 15 minutes.',
      invalidToken: 'Form invalid. Please try again.',
    },
    contact: {
      title: 'Contact',
      HTML:
        '<p>Please provide contact information according to the legislation of your country.</p>',
    },
    privacy: {
      title: 'Privacy Policy',
      HTML:
        '<p>Please provide legal information according to the legislation of your country.</p>',
    },
    success: {
      title: 'Registration successful',
      message: 'Your registration was successful.',
      login: 'Login',
    },
    map: {
      background: 'Background:',
    },
    statusBar: {
      name: 'Name:',
      score: 'Score:',
      sessionReady: 'Session: ready',
      session: 'Session:',
      highscore: 'Highscore',
      profile: 'Profile',
      logout: 'Logout',
    },
    profile: {
      title: 'Profile',
      username: 'Username:',
      score: 'Score:',
      solved: 'Challenges solved:',
      lastActive: 'Last active:',
      room: 'Room:',
      sessionReady: 'Session is ready. Solve a challenge to start it.',
      startSession: 'Start session now!',
      sessionActive: 'Session is running...',
      endSession: 'End session now!',
      sessionDone: 'Session done.',
      sessionScore: 'Session score:',
    },
    challenge: {
      back: 'back',
      solvedBy: 'solved by',
      users: 'people',
      user: 'person',
      continue: 'continue',
      correct: 'is correct',
      wrong: 'is wrong',
      locked: 'After 20 tries, you must pause for 30 seconds. Please wait',
    },
    roomscore: {
      title: 'Highscore',
      heading: 'Highscore: ',
    },
    finish: {
      title: 'Session finished',
      html: '<p>Well done!</p>',
      ok: 'OK',
    },
  }

  config.translations = {
    de: {
      share: {
        go: 'Los',
        back: 'Zurück',
      },
      home: {
        loginHeading: 'Login',
        invalid: 'Falsche Zugangsdaten',
        name: 'Name:',
        password: 'Passwort:',
        invite: 'Neu hier? Erstelle einen kostenlosen Account und lege los:',
        registerLink: 'Registrierung',
        joinRoom: 'Raum beitreten',
        hackerOfTheMonth: 'Top 10 des Monats',
        showHighscore: 'alle anzeigen',
        rooms: 'Räume',
        inviteOrga: 'Leitest du eine Veranstaltung? Hier kannst du',
        createRoom: 'einen eigenen Raum anlegen',
        contactLink: 'Kontakt',
        privacyLink: 'Datenschutzerklärung',
        github: 'GitHub',
        version: 'Version: Mai 2020',
      },
      register: {
        title: 'Registrierung',
        username: 'Benutzername',
        password: 'Passwort',
        repeatPassword: 'Passwort wiederholen',
        usernameNote: `Min. ${config.accounts.minUsername} Zeichen`,
        passwordNote: `Min. ${config.accounts.minPw} Zeichen`,
        noteOn: 'Hinweis zum',
        dataProtection: 'Datenschutz',
        nameTooShort: 'Benutzername zu kurz.',
        nameTooLong: `Benutzername zu lang, max. ${config.accounts.maxUsername} Zeichen.`,
        nameInvalidChars: 'Benutzername enthält ungültige Zeichen.',
        pwTooShort: 'Passwort zu kurz.',
        pwTooLong: 'Passwort zu lang.',
        pwMismatch: 'Passwörter stimmen nicht überein.',
        invalidToken:
          'Übermittelte Daten gehört nicht zu dieser Sitzung. Bitte erneut versuchen.',
        failure: 'Registrierung fehlgeschlagen. Bitte erneut versuchen.',
        nameExists: 'Benutzername existiert bereits.',
        serverCrowded:
          'Es gibt im Moment ein hohes Aufkommen an Registrierungen, versuche es in 15 Minuten erneut.',
      },
      join: {
        title: 'Beitreten',
        key: 'Raumschlüssel:',
        roomNotFound: 'Raum nicht gefunden!',
      },
      highscore: {
        title: 'Highscore',
        empty: 'Die Highscore enthält noch keine Einträge. Werde der Erste!',
        rank: 'Platz',
        name: 'Benutzername',
        score: 'Punktzahl',
        sessionScore: 'Session-Punktzahl',
        lastActive: 'zuletzt aktiv',
        showRoomScore: 'nur Raum',
        showGlobalScore: 'alle anzeigen',
      },
      create: {
        title: 'Raum erstellen',
        yourRooms: 'Meine Räume',
        key: 'Neuer Raumschlüssel:',
        go: 'Erstellen',
        information:
          'Über einen Raum kannst gemeinsam mit einer Gruppe teilnehmen und das Session-System nutzen. Eine Session dauert 30 Minuten. In dieser Zeit könen Aufgaben bearbeitet und Punkte gesammelt werden. Nach Ablauf der 30 Minuten wird die Punktzahl in einer lokalen Highscore gespeichert. Nach der Session können die Teilnehmer als normale Benutzer weiter an den Aufgaben arbeiten.',
        keyInvalid: 'Raumschlüssel darf nur Buchstaben und Ziffern enthalten.',
        keyTooShort: 'Raumschlüssel zu kurz.',
        keyTooLong: 'Raumschlüssel zu lang.',
        keyExists: 'Raumschlüssel existiert bereits.',
        failure: 'Raumerstellung fehlgeschlagen. Bitte erneut versuchen.',
        keyNote: `${config.accounts.minRoom} - ${config.accounts.minRoom} Zeichen, alpha-numerisch`,
        serverCrowded:
          'Es gibt im Moment ein hohes Aufkommen an Raumerstellungen, versuche es in 15 Minuten erneut.',
        invalidToken:
          'Übermittelte Daten gehört nicht zu dieser Sitzung. Bitte erneut versuchen.',
      },
      contact: {
        title: 'Kontakt',
        HTML:
          '<p>Bitte stelle Kontaktinformation passend zur Gesetzgebung deines Landes zur Verfügung.</p>',
      },
      privacy: {
        title: 'Datenschutzerklärung',
        HTML:
          '<p>Bitte stelle eine Datenschutzerklärung passend zur Gesetzgebung deines Landes zur Verfügung.</p>',
      },
      success: {
        title: 'Registrierung erfolgreich',
        message: 'Deine Registrierung war erfolgreich.',
        login: 'zum Login',
      },
      map: {
        background: 'Hintergrundbild:',
      },
      statusBar: {
        name: 'Name:',
        score: 'Punkte:',
        sessionReady: 'Session: bereit',
        session: 'Session:',
        highscore: 'Highscore',
        profile: 'Profil',
        logout: 'abmelden',
      },
      profile: {
        title: 'Profil',
        username: 'Benutzername:',
        score: 'Punktzahl:',
        solved: 'Gelöste Aufgaben:',
        lastActive: 'Zuletzt aktiv:',
        room: 'Raum:',
        sessionReady:
          'Session ist bereit. Löse eine Aufgabe, um sie zu starten.',
        startSession: 'Session jetzt starten!',
        sessionActive: 'Session läuft...',
        endSession: 'Session jetzt beenden!',
        sessionDone: 'Session fertig.',
        sessionScore: 'Session-Punktzahl:',
      },
      challenge: {
        back: 'zurück',
        solvedBy: 'gelöst von',
        users: 'Personen',
        user: 'Person',
        continue: 'weiter',
        correct: 'ist richtig',
        wrong: 'ist falsch',
        locked:
          'Du musst nach 20 Versuchen jeweils eine Pause von 30 Sekunden einlegen. Bitte warte noch',
      },
      roomscore: {
        title: 'Highscore',
        heading: 'Highscore: ',
      },
      finish: {
        title: 'Session beendet',
        html: '<p>Gut gemacht!</p>',
        ok: 'OK',
      },
    },
    fr: {
      share: {
        go: 'Allez',
        back: 'Retour',
      },
      home: {
        loginHeading: 'Login',
        invalid: "Données d'accès erronées.",
        name: 'Nom:',
        password: 'Mot de passe:',
        invite: 'Vous êtes nouveau ici? Créez un compte gratuit et commencez:',
        registerLink: 'Inscription',
        joinRoom: 'Rejoindre une salle',
        hackerOfTheMonth: 'Top 10 du Mois',
        showHighscore: 'tout afficher',
        rooms: 'Salles',
        inviteOrga: 'Vous organisez un événement? Ici, vous pouvez',
        createRoom: 'créer votre propre chambre',
        contactLink: 'Contact',
        privacyLink: 'Politique de confidentialité',
        github: 'GitHub',
        version: 'version: mai 2020',
      },
      register: {
        title: 'Inscription',
        username: 'Nom',
        password: 'Mot de passe',
        repeatPassword: 'Répéter le mot de passe',
        usernameNote: `Min. ${config.accounts.minUsername} lettres`,
        passwordNote: `Min. ${config.accounts.minPw} lettres`,
        noteOn: 'Note sur la',
        dataProtection: 'protection des données',
        nameTooShort: "Nom d'utilisateur trop court.",
        nameTooLong: `Nom d'utilisateur trop long, max. ${config.accounts.maxUsername} lettres.`,
        nameInvalidChars:
          "Le nom d'utilisateur contient des caractères non valides.",
        pwTooShort: 'Mot de passe trop court.',
        pwTooLong: 'Mot de passe trop long.',
        pwMismatch: 'Les mots de passe ne correspondent pas.',
        invalidToken:
          "Les données transmises n'appartiennent pas à cette session. Veuillez réessayer.",
        failure: "L'enregistrement a échoué. Veuillez réessayer.",
        nameExists: "Le nom d'utilisateur existe déjà.",
        serverCrowded:
          "Il y a un grand nombre d'inscriptions en ce moment, essayez à nouveau dans 15 minutes.",
      },
      join: {
        title: 'Rejoignez',
        key: 'Clé de la chambre:',
        roomNotFound: 'Chambre non trouvée!',
      },
      highscore: {
        title: 'Highscore',
        empty:
          'Le highscore ne contient encore aucune entrée. Soyez les premiers!',
        rank: 'Position',
        name: 'Nom',
        score: 'Score',
        sessionScore: 'Session Score',
        lastActive: 'dernier actif',
        showRoomScore: 'seulement la chambre',
        showGlobalScore: 'tout afficher',
      },
      create: {
        title: 'Créer une chambre',
        yourRooms: 'Mes chambres',
        key: 'Nouvelle clé de chambre:',
        go: 'Créer',
        information:
          "Via une salle, vous pouvez participer avec un groupe et utiliser le système de session. Une séance dure 30 minutes. Pendant ce temps, vous pouvez travailler sur des tâches et collecter des points. Une fois les 30 minutes écoulées, le score est enregistré dans un classement local. Après la session, les participants peuvent continuer à travailler sur les tâches en tant qu'utilisateurs normaux.",
        keyInvalid:
          'La clé de la chambre ne peut contenir que des lettres et des chiffres.',
        keyTooShort: 'Clé de chambre trop court.',
        keyTooLong: 'Clé de chambre trop long.',
        keyExists: 'Clé de chambre existe déjà.',
        failure: 'La création de salles a échoué. Veuillez réessayer.',
        keyNote: `${config.accounts.minRoom} - ${config.accounts.minRoom} lettres, alpha-numérique`,
        serverCrowded:
          'Il y a un grand volume de créations de salles en ce moment, essayez de nouveau dans 15 minutes.',
        invalidToken:
          "Les données transmises n'appartiennent pas à cette session. Veuillez réessayer.",
      },
      contact: {
        title: 'Contact',
        HTML:
          '<p>Veuillez fournir les coordonnées appropriées à la législation de votre pays.</p>',
      },
      privacy: {
        title: 'Politique de confidentialité',
        HTML:
          '<p>Veuillez fournir une politique de confidentialité adaptée à la législation de votre pays.</p>',
      },
      success: {
        title: 'Inscription réussie',
        message: 'Votre inscription a été réussie.',
        login: 'login',
      },
      map: {
        background: "Fond d'écran:",
      },
      statusBar: {
        name: 'Nom:',
        score: 'Score:',
        sessionReady: 'Session: prêt',
        session: 'Session:',
        highscore: 'Highscore',
        profile: 'Profil',
        logout: 'Déconnexion',
      },
      profile: {
        title: 'Profil',
        username: 'Nom:',
        score: 'Score:',
        solved: 'Tâches résolues:',
        lastActive: 'dernier actif:',
        room: 'Chambre:',
        sessionReady:
          'La session est prête. Résolvez une tâche pour la démarrer.',
        startSession: 'Démarrer la session maintenant!',
        sessionActive: 'Déroulement de la session...',
        endSession: 'Fin de la session!',
        sessionDone: 'La session est terminée.',
        sessionScore: 'Session score:',
      },
      challenge: {
        back: 'retour',
        solvedBy: 'touchés par',
        users: 'personnes',
        user: 'personne',
        continue: 'en savoir plus',
        correct: 'est correcte',
        wrong: 'est erronée',
        locked:
          'Vous devez faire une pause de 30 secondes après 20 tentatives. Veuillez patienter',
      },
      roomscore: {
        title: 'Highscore',
        heading: 'Highscore: ',
      },
      finish: {
        title: 'Fin de la session',
        html: '<p>Bien joué!</p>',
        ok: 'OK',
      },
    },
  }

  return config
}
