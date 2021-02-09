import jwt from 'jsonwebtoken';

export const authenticateMicroService = (microService: string, token: string) => {
    const key = getRSAKey(microService);
    return jwt.verify(token, key);
}

export const buildJwt = () => {
    const key = 'secret';
    const payload = {
        name: 'API_Gateway'
    };
    return jwt.sign(payload, key, {expiresIn: '10m'});
};

function getRSAKey(microService: string) {
    return 'secret'
}