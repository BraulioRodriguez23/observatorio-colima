export default function Notice({ data }) {
    return (
      <div className="col-md-4 mb-4">
        <div className="card h-100">
          <div className="card-body">
            <h5 className="card-title">{data.title}</h5>
            <p className="card-text">{data.content}</p>
            <small className="text-muted">{new Date(data.date).toLocaleDateString()}</small>
          </div>
        </div>
      </div>
    );
  }