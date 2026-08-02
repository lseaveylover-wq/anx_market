import './Skeleton.css';

export const Skeleton = ({ width = '100%', height = '20px', borderRadius = '8px', className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
};

export const SkeletonBox = ({ width = '100%', height = '1rem', radius = '8px', style = {} }) => (
  <div
    className="skeleton-box"
    style={{ width, height, borderRadius: radius, ...style }}
  />
);

export const SkeletonTable = ({ rows = 5, columns = 6 }) => {
  return (
    <div className="skeleton-table-container">
      <table className="skeleton-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <Skeleton width="80%" height="16px" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <Skeleton width="90%" height="20px" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-header">
        <div className="skeleton-user">
          <Skeleton width="50px" height="50px" borderRadius="50%" />
          <div className="skeleton-user-info">
            <Skeleton width="120px" height="16px" />
            <Skeleton width="180px" height="14px" />
          </div>
        </div>
        <Skeleton width="80px" height="24px" borderRadius="12px" />
      </div>
      <div className="skeleton-card-body">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="95%" height="14px" />
        <Skeleton width="88%" height="14px" />
      </div>
      <div className="skeleton-card-footer">
        <Skeleton width="100px" height="36px" borderRadius="10px" />
        <Skeleton width="100px" height="36px" borderRadius="10px" />
      </div>
    </div>
  );
};

export const SkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export const SkeletonStatCard = () => {
  return (
    <div className="skeleton-stat-card">
      <div className="skeleton-stat-header">
        <Skeleton width="50px" height="50px" borderRadius="15px" />
        <Skeleton width="60px" height="24px" borderRadius="12px" />
      </div>
      <Skeleton width="80px" height="32px" />
      <Skeleton width="100px" height="16px" />
    </div>
  );
};

export const SkeletonDashboard = () => {
  return (
    <div className="skeleton-dashboard">
      {/* Header */}
      <div className="skeleton-header">
        <div>
          <Skeleton width="250px" height="32px" />
          <Skeleton width="180px" height="16px" />
        </div>
        <Skeleton width="200px" height="60px" borderRadius="30px" />
      </div>

      {/* Stats Grid */}
      <div className="skeleton-stats-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="skeleton-dashboard-grid">
        <div className="skeleton-dashboard-card">
          <Skeleton width="180px" height="24px" />
          <div className="skeleton-activity-list">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-activity-item">
                <Skeleton width="40px" height="40px" borderRadius="10px" />
                <div className="skeleton-activity-content">
                  <Skeleton width="200px" height="16px" />
                  <Skeleton width="80px" height="14px" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="skeleton-dashboard-card">
          <Skeleton width="180px" height="24px" />
          <div className="skeleton-actions">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} width="100%" height="50px" borderRadius="12px" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
