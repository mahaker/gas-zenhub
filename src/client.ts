type Pipelines = Map<string, string>

export class Client {
  constructor(
    readonly workspaceId: string,
    readonly repositoryId: number,
    readonly token: string
  ) {}

  fetchPipelines(): Pipelines {
    const res = UrlFetchApp.fetch(
      `https://api.zenhub.com/p2/workspaces/${this.workspaceId}/repositories/${this.repositoryId}/board`,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication-Token': this.token
        }
      }
    )

    const pipelines: {id: string, name: string}[] = JSON.parse(res.getContentText()).pipelines
    const pipelineMap: Pipelines = new Map()
    pipelines.forEach(_ => pipelineMap.set(_.name, _.id))
    return pipelineMap
  }

  setEstimate(issueNo: number, estimate: number): void {
    UrlFetchApp.fetch(
      `https://api.zenhub.com/p1/repositories/${this.repositoryId}/issues/${issueNo}/estimate`,
      {
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication-Token': this.token
        },
        payload: JSON.stringify({estimate})
      }
    )
  }

  setEpic(epicIssueNo: number, issueNo: number): void {
    UrlFetchApp.fetch(
      `https://api.zenhub.com/p1/repositories/${this.repositoryId}/epics/${epicIssueNo}/update_issues`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication-Token': this.token
        },
        payload: JSON.stringify({remove_issues: [], add_issues: [{repo_id: this.repositoryId, issue_number: issueNo}]})
      }
    )
  }

  movePipelineTo(issueNo: number, pipelineId: string): void {
    UrlFetchApp.fetch(
      `https://api.zenhub.com/p2/workspaces/${this.workspaceId}/repositories/${this.repositoryId}/issues/${issueNo}/moves`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-Authentication-Token': this.token
        },
        payload: JSON.stringify({pipeline_id: pipelineId, position: 'top'})
      }
    )
  }
}
