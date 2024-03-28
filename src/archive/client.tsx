import Archive from './index';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <Archive {...window.PJBLOG_INITIALIZE_STATE} />)