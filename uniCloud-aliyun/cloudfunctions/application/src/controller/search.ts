import * as explain from 'explain';
import searchService from '../service/search';
import * as ISearch from '../../proto/search';
export = class SearchController extends explain.service {
  private service: searchService;
  constructor(e: ExplainController) {
    super(e);
    this.service = new searchService(this.context);
  }
  /**
   * @name 增加搜索记录
   * @param ISearch.AddSeachLog
   * @return {*}  {Promise<unknown>}
   * @link https://www.yuque.com/mlgrgm/lmm8g4/fblw8z#g13V0
   * @memberof SearchController
   */
  addSeachLog(): Promise<unknown> {
    return this.service.addSeachLog(this.event.data as ISearch.AddSeachLog);
  }
};
