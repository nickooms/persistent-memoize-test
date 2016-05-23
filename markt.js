import Taal from './Taal';
import Gewest from './Gewest';
import Gemeente from './Gemeente';
import Straat from './Straat';
import { log } from './log';
const TAAL = 'Nederlands';
const GEWEST = 'Vlaams Gewest';
const GEMEENTE = 'Stabroek';
const STRAAT = 'Markt';

Taal.find({ naam: TAAL }).then(log)
.then(taal => Gewest.find({ taalCode: taal.code, naam: GEWEST })).then(log)
.then(gewest => Gemeente.find({ gewestId: gewest.id, naam: GEMEENTE })).then(log)
.then(gemeente => Straat.find({ gemeenteId: gemeente.id, naam: STRAAT })).then(log);
