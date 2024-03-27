import Detail from './index';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <Detail {...window.PJBLOG_INITIALIZE_STATE} />)