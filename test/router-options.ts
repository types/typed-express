
import {Router, RouterOptions} from 'express';

const options: RouterOptions = {
    caseSensitive: true,
    mergeParams: true,
    strict: true
};

const router = Router(options);

export default router;
