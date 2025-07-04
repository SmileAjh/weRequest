import sessionManager from '../module/sessionManager'

export default (session: Record<string, any>) => {
    sessionManager.setSession(session);
}
