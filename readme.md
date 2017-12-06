Site d'annonce de déménagement

Ce site à pour but de mettre en relation des déménageurs et des personnes souhaitant arrondir leur fin de mois tout en aidant leurs prochains.

Ce site est développé par ALLALI Kamal, FOFANA Mohamed et SADJI Nadjim dans le cadre de la formation d'ingénieur à l'ESIEA. 
Nous avons utilisé les technologies suivantes : Node.js (Express et socket.io) et MongoDB en utilisant une architecture MVC.

Fonctionnalités présentes dans le site :
- Création d'un compte avec validation de formulaire asynchrone (tous les mots de passes sont hashés lors de la crétion du compte, donc indéchiffrable si on récupère la base)
- Connexion au site via login et mot de passe
- Création modification et suppression d'une annonce (seul le propriétaire de l'annonce ou un administrateur du site peuvent la supprimée)
- Recherche d'une annonce via un fomulaire ajax (les resultats sont affichés aux fur et à mesure que l'utilisateur tape les mots clés)
- Gestion des status des utilisateurs (admin ou non), un administrateur peux modifier les données d'un compte (sauf le mot de passe), supprimer et modifier une annonce, bloquer ou débloquer un utilisateur. Si un utilisateur est bloqué il ne peux que se connecter, il ne peux plus créer, modifier ou supprimer une annonce mais il peux toujours les consulter. L'administrateur a accès à la liste de tous les utilisateurs et voit qui est admin ou non et peux bloquer des utilisateurs via cette page (le bouton est controllé avec ajax donc tous se fait sans rechargement de page et est très fluide pour l'utilisateur)
- Tchat en temps réel, à l'aide de Socket.io
- Possibilité de changer le thème du site (pérsistence via les cookies)
