defprotocol Protocol.WebApp do
  @fallback_to_any true
  def url(resource)
end

defimpl Protocol.WebApp, for: Scrumpointer.Web.Comment do
  def url(comment) do
    "https://workplace.scrumex.com/app/projects/#{comment.project_id}/stories/#{comment.poll_id}"
  end
end

defimpl Protocol.WebApp, for: Any do
  def url(_) do
    "https://workplace.scrumex.com/app"
  end
end
