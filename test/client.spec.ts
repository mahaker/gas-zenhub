import { Client } from '../src/client'

describe('Client#fetchPipelines', () => {
  beforeEach(() => {
    UrlFetchApp.fetch = jest.fn(() => {
      return {
        getContentText: () => `
          {
            "pipelines": [
              {
                "id": "595d430add03f01d32460080",
                "name": "New Issues",
                "issues": []
              },
              {
                "id": "595d430add03f01d32460081",
                "name": "Backlog",
                "issues": []
              },
              {
                "id": "595d430add03f01d32460082",
                "name": "To Do",
                "issues": []
              }
            ]
          }
        `
      } as GoogleAppsScript.URL_Fetch.HTTPResponse
    })
  })

  test('case1', () => {
    // arrange
    const workspaceId = 'myworkspace'
    const repositoryId = 123456789
    const token = 'mytoken'

    // action
    const client = new Client(workspaceId, repositoryId, token)
    const pipelines = client.fetchPipelines()

    // assert
    expect(pipelines.size).toEqual(3)
    expect(pipelines.get('New Issues')).toEqual('595d430add03f01d32460080')
    expect(pipelines.get('Backlog')).toEqual('595d430add03f01d32460081')
    expect(pipelines.get('To Do')).toEqual('595d430add03f01d32460082')
    expect(UrlFetchApp.fetch).toHaveBeenCalledTimes(1)
    expect(UrlFetchApp.fetch).toHaveBeenLastCalledWith(`https://api.zenhub.com/p2/workspaces/${workspaceId}/repositories/${repositoryId}/board`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authentication-Token': token
      }
    })
  })
})

describe('Client#setEstimate', () => {
  beforeEach(() => {
    UrlFetchApp.fetch = jest.fn()
  })
  test('case1', () => {
    // arrange
    const workspaceId = 'myworkspace'
    const repositoryId = 123456789
    const token = 'mytoken'
    const issueNo = 123
    const estimate = 0.5

    // action
    const client = new Client(workspaceId, repositoryId, token)
    client.setEstimate(issueNo, estimate)

    // assert
    expect(UrlFetchApp.fetch).toHaveBeenCalledTimes(1)
    expect(UrlFetchApp.fetch).toHaveBeenLastCalledWith(`https://api.zenhub.com/p1/repositories/${repositoryId}/issues/${issueNo}/estimate`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        'X-Authentication-Token': token
      },
      payload: JSON.stringify({estimate})
    })
  })
})

describe('Client#setEpic', () => {
  beforeEach(() => {
    UrlFetchApp.fetch = jest.fn()
  })
  test('case1', () => {
    // arrange
    const workspaceId = 'myworkspace'
    const repositoryId = 123456789
    const token = 'mytoken'
    const epicIssueNo = 50
    const issueNo = 123

    // action
    const client = new Client(workspaceId, repositoryId, token)
    client.setEpic(epicIssueNo, issueNo)

    // assert
    expect(UrlFetchApp.fetch).toHaveBeenCalledTimes(1)
    expect(UrlFetchApp.fetch).toHaveBeenLastCalledWith(`https://api.zenhub.com/p1/repositories/${repositoryId}/epics/${epicIssueNo}/update_issues`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authentication-Token': token
      },
      payload: JSON.stringify({remove_issues: [], add_issues: [{repo_id: repositoryId, issue_number: issueNo}]})
    })
  })
})

describe('Client#movePipelineTo', () => {
  beforeEach(() => {
    UrlFetchApp.fetch = jest.fn()
  })
  test('case1', () => {
    // arrange
    const workspaceId = 'myworkspace'
    const repositoryId = 123456789
    const token = 'mytoken'
    const issueNo = 123
    const pipelineId = 'pipeline1'

    // action
    const client = new Client(workspaceId, repositoryId, token)
    client.movePipelineTo(issueNo, pipelineId)

    // assert
    expect(UrlFetchApp.fetch).toHaveBeenCalledTimes(1)
    expect(UrlFetchApp.fetch).toHaveBeenLastCalledWith(`https://api.zenhub.com/p2/workspaces/${workspaceId}/repositories/${repositoryId}/issues/${issueNo}/moves`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authentication-Token': token
      },
      payload: JSON.stringify({pipeline_id: pipelineId, position: 'top'})
    })
  })
})
