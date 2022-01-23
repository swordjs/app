import { ActionResult } from '../../typings';
import request from '../common/request';

export async function addCertificationApplyOrder(params: { content: Record<string, unknown> }): Promise<ActionResult> {
  return await request({
    route: `api/certificationApplyOrder`,
    method: 'POST',
    data: {
      content: params.content
    }
  });
}
