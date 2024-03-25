import { Service } from '@zille/service';
import { BlogVariable } from '@pjblog/blog';

@Service.Injectable()
export class BlogMetaDataProvider extends Service {
  @Service.Inject(BlogVariable)
  private readonly configs: BlogVariable;

  public htmlMetaData() {
    return {
      title: this.configs.get('title'),
      description: this.configs.get('description'),
      keywords: this.configs.get('keywords'),
      domain: this.configs.get('domain'),
    }
  }

  public blogMetaData() {
    return {
      theme: this.configs.get('theme'),
      icp: this.configs.get('icp'),
      close: this.configs.get('close'),
      reason: this.configs.get('closeReason'),
      registable: this.configs.get('registable'),
      commentable: this.configs.get('mediaCommentable'),
    }
  }
}