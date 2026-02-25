import torch
import torch.nn as nn

class AttentionCNNBiLSTM(nn.Module):
    def __init__(self, input_dim: int, hidden_dim: int, num_classes: int):
        super().__init__()
        # Spatial Feature Extraction
        self.cnn = nn.Sequential(
            nn.Conv1d(in_channels=input_dim, out_channels=32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv1d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.Conv1d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
            nn.ReLU()
        )
        
        # Temporal Modeling
        self.bilstm = nn.LSTM(
            input_size=128, hidden_size=hidden_dim, num_layers=2,
            batch_first=True, bidirectional=True
        )
        
        # Multi-head Self-attention
        self.attention = nn.MultiheadAttention(embed_dim=hidden_dim*2, num_heads=4, batch_first=True)
        
        # Classification Head
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim*2, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )

    def forward(self, x):
        # x shape (batch, seq_len, features) => (batch, features, seq_len) for CNN
        x = x.transpose(1, 2)
        x = self.cnn(x)
        # x shape (batch, 128, seq_len) => (batch, seq_len, 128)
        x = x.transpose(1, 2)
        
        lstm_out, _ = self.bilstm(x)
        attn_out, _ = self.attention(lstm_out, lstm_out, lstm_out)
        
        # Process the last time step for classification
        last_step_features = attn_out[:, -1, :]
        logits = self.classifier(last_step_features)
        return logits
