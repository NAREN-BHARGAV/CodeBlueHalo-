from sklearn.mixture import GaussianMixture
import numpy as np

class BehavioralDriftDetector:
    def __init__(self, n_components=2):
        self.gmm = GaussianMixture(n_components=n_components, covariance_type='full')
        self.fitted = False

    def fit_baseline(self, historical_features: np.ndarray):
        """
        Features: [total_active_mins, longest_inactive_mins, exit_count, avg_temp]
        """
        if len(historical_features) < 7:
            return False # Need at least a week of data
        self.gmm.fit(historical_features)
        self.fitted = True
        return True

    def calculate_drift_score(self, daily_vector: np.ndarray) -> float:
        if not self.fitted:
            return 0.0
        
        # Calculate log likelihood of the current day's behavior
        score = -self.gmm.score_samples([daily_vector])[0]
        return float(score)

    def check_alert(self, drift_scores: list, threshold: float = 10.0) -> bool:
        """
        Alerts if drift score exceeds threshold for 3 consecutive days.
        """
        if len(drift_scores) < 3:
            return False
        return all(s > threshold for s in drift_scores[-3:])
