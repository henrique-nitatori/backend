import Passport from 'passport'
import PassportGitHub from 'passport-github2'
import Router, { Response, Request, NextFunction } from 'express'

const gitHubAuthenticationRoutes = Router()
// Serializado e desserilizador do passport para conseguir ter acesso a sessão
Passport.serializeUser(function (user, done) {
  done(null, user);
});

Passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


// Estratégia de login via oAuth2 pelo github
const gitHubStrategy = PassportGitHub.Strategy
Passport.use(new gitHubStrategy({
  clientID: "758476e4dd024bea1feb",
  clientSecret: "4a7123cbce000c8ab8212b2cd4bb59935bb556c6",
  callbackURL: 'http://localhost:4000/auth/github/callback'

},
  // Função callback que server de midleware para ter acesso as informações nas rotas
  function (accessToken: string, refreshToken: string, profile: any, done: (arg0: null, arg1: any, arg2: { token: string }) => any) {
    console.log('RECEBEU O TOKEN:', accessToken)
    return done(null, profile, { token: accessToken })
  }))

// Rota de autenticação, aonde é redireciano até o github para confirmar as credenciais
gitHubAuthenticationRoutes.get('/auth/github', Passport.authenticate('github', { scope: ['user:email'] }))

// Rota callback, depois de ter acessado e informado os dados ao github ele retorna a essa rota aonde aqui se faz a
// ação de quando for sucesso e quando falhar
gitHubAuthenticationRoutes.get('/auth/github/callback', Passport.authenticate('github', { failureRedirect: String(process.env.FAIL_LOGIN) }),
function(req, res) {
  return res.redirect(String(process.env.SUCCESS_LOGIN))
});

// rota de logout da aplicação ela destroy a sessao e deleta o cookie do usuário
gitHubAuthenticationRoutes.get('/logout', (req, res) => {
    req.logout()
    res.status(200).clearCookie('session', {
        path: '/'
      });
    req.session?.destroy((err) => {
        res.status(200).send()
    })
  })
  
// Verificador de rota, ele testa de usuário esta logado na plataforma
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) { return next(); }
    res.status(400).json (
      {message: "user has not been authenticated",
          authenticated: false,
        })
  }


export { ensureAuthenticated, gitHubAuthenticationRoutes }