interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
}

import './database';
import './cloudfunctions';
