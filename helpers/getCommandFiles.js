import fs from 'fs';
import path from 'path';

export default function getCommandFiles() {
    return fs.readdirSync(path.resolve('commands')).filter(file => file.endsWith('.js'));
}
