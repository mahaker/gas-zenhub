## ZenHub API client for Google Apps Script

### Usage

```shell
$npm install gas-zenhub
# or
$yarn add gas-zenhub
```

:hammer_and_wrench: This is useful with [gas-github](https://github.com/mahaker/gas-github)!

```javascript
import { Client as GitHubClient } from 'gas-github'
import { Client as ZenHubClient } from 'gas-zenhub'

function openIssue() {
  const githubClient = new GitHubClient('org', 'repo', 'token')
  const zenhubClient = new ZenHubClient('workspace', 123456789, 'token')

  // open issue
  const issueNo = githubClient.openIssue({title: 'gas-github-test', body: 'bodybody\nbodybodybody', labels: ['bug', 'documentation']})

  // set estimate
  zenhubClient.setEstimate(issueNo, 5)

  // set epic issue
  zenhubClient.setEpic(1, issueNo)

  // move pipeline
  const pipelines = zenhubClient.fetchPipelines()
  zenhubClient.movePipelineTo(issueNo, pipelines.get('Backlog'))
}
```

### Contribution

Welcome contributions and feedbacks!
