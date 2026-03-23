import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { isAddress } from 'viem'
import { PRESALE_CONTRACT_ADDRESS, presaleAbi } from '../config/contract'

export default function OGChecker() {
  const { address: connectedAddress, isConnected } = useAccount()
  const [inputAddress, setInputAddress] = useState('')
  const [checkAddress, setCheckAddress] = useState<`0x${string}` | null>(null)

  // Check connected wallet
  const { data: connectedIsOG } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'ogWhitelist',
    args: connectedAddress ? [connectedAddress] : undefined,
    query: { enabled: !!connectedAddress },
  })

  // Check manually entered address
  const { data: manualIsOG } = useReadContract({
    address: PRESALE_CONTRACT_ADDRESS,
    abi: presaleAbi,
    functionName: 'ogWhitelist',
    args: checkAddress ? [checkAddress] : undefined,
    query: { enabled: !!checkAddress },
  })

  const handleCheck = () => {
    const addr = inputAddress.trim()
    if (isAddress(addr)) {
      setCheckAddress(addr as `0x${string}`)
    }
  }

  const showConnectedResult = isConnected && connectedIsOG !== undefined
  const showManualResult = checkAddress && manualIsOG !== undefined

  return (
    <section className="fade-up">
      <div className="section-label">OG Status</div>
      <h2>Check if you're an OG</h2>
      <p className="section-desc">
        26 wallets from the V1 presale are whitelisted as OGs and receive a 10% bonus
        on their V2 contribution.
      </p>

      <div className="og-checker-box">
        {/* Connected wallet result */}
        {showConnectedResult && (
          <div className={`og-result ${connectedIsOG ? 'og-yes' : 'og-no'}`}>
            {connectedIsOG ? (
              <>
                <span className="og-result-icon">&#9733;</span>
                <div>
                  <strong>You're an OG!</strong>
                  <p>Your wallet qualifies for a 10% bonus on contributions.</p>
                </div>
              </>
            ) : (
              <>
                <span className="og-result-icon">&#x1f44b;</span>
                <div>
                  <strong>Not OG — but you can still contribute!</strong>
                  <p>Everyone is welcome to participate in the presale.</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Manual checker */}
        <div className="og-input-row">
          <input
            type="text"
            className="og-input"
            placeholder="Paste wallet address (0x...)"
            value={inputAddress}
            onChange={(e) => {
              setInputAddress(e.target.value)
              setCheckAddress(null)
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          />
          <button
            className="btn-primary og-check-btn"
            onClick={handleCheck}
            disabled={!inputAddress.trim() || !isAddress(inputAddress.trim())}
          >
            Check
          </button>
        </div>

        {/* Manual result */}
        {showManualResult && (
          <div className={`og-result ${manualIsOG ? 'og-yes' : 'og-no'}`}>
            {manualIsOG ? (
              <>
                <span className="og-result-icon">&#9733;</span>
                <div>
                  <strong>This wallet is OG!</strong>
                  <p>10% bonus applies to contributions from this address.</p>
                </div>
              </>
            ) : (
              <>
                <span className="og-result-icon">&#x2014;</span>
                <div>
                  <strong>Not on the OG list</strong>
                  <p>This address can still contribute — just without the bonus.</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
