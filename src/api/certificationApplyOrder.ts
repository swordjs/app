import callFunction from "../common/callFunction";

export async function addCertificationApplyOrder(params: { content: object }): Promise<ActionResult> {
  return await callFunction({
    name: "application",
    data: {
      route: `api/certificationApplyOrder`,
      method: "POST",
      params: {
        content: params.content
      },
    },
  });
}
