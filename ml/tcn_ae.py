import torch
import torch.nn as nn

class TCNAE(nn.Module):
    def __init__(self, in_channels: int, sequence_length: int = 32):
        super().__init__()
        # Encoder: Dilated Causal Convolutions
        self.encoder = nn.Sequential(
            nn.Conv1d(in_channels, 8, kernel_size=3, dilation=1, padding=2),
            nn.ReLU(),
            nn.Conv1d(8, 16, kernel_size=3, dilation=2, padding=4),
            nn.ReLU(),
            nn.Conv1d(16, 8, kernel_size=3, dilation=4, padding=8),
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(8 * (sequence_length + 14), 4) # Bottleneck 4-dim
        )
        
        # Decoder
        self.decoder_linear = nn.Linear(4, 8 * sequence_length)
        self.decoder = nn.Sequential(
            nn.ConvTranspose1d(8, 16, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(16, 8, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.ConvTranspose1d(8, in_channels, kernel_size=3, padding=1)
        )

    def forward(self, x):
        # x shape: (batch, in_channels, seq_len)
        encoded = self.encoder(x)
        decoded = self.decoder_linear(encoded)
        decoded = decoded.view(x.size(0), 8, -1)
        reconstructed = self.decoder(decoded)
        # align seq len
        return reconstructed[:, :, :x.size(2)]
