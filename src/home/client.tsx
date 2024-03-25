import Home from './index';
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <Home state={window.PJBLOG_INITIALIZE_STATE} />)