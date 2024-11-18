# Parâmetros de entrada
$source = "C:\Users\info\Documents\Projetos sysdev\Vya-Jobs\ByteStash"
$destination = "Z:\Dev\docker\code-store"
$excludeList = "C:\Users\info\Documents\Projetos sysdev\Vya-Jobs\ByteStash\exclude-list.txt"

# Validar se os caminhos de origem e destino existem
if (-not (Test-Path $source)) {
    Write-Error "O caminho de origem '$source' não existe."
    return $false
}

if (-not (Test-Path (Split-Path $destination -Parent))) {
    Write-Error "O diretório pai do destino '$destination' não existe."
    return $false
}

# Validar se o arquivo de exclusão existe
if (-not (Test-Path $excludeList)) {
    Write-Error "O arquivo de lista de exclusão '$excludeList' não foi encontrado."
    return $false
}

# Carregar padrões de exclusão
try {
    $excludePatterns = Get-Content $excludeList
} catch {
    Write-Error "Erro ao ler a lista de exclusão: $_"
    return $false
}

# Criar a lógica de exclusão
$shouldExclude = {
    param ($file)
    foreach ($pattern in $excludePatterns) {
        if ($file.FullName -like "*$pattern*") {
            return $true
        }
    }
    return $false
}

# Função recursiva para copiar diretórios e arquivos
function Copy-WithExclusion {
    param (
        [Parameter(Mandatory=$true)][string]$SourcePath,
        [Parameter(Mandatory=$true)][string]$DestinationPath,
        [scriptblock]$ExclusionLogic
    )

    # Criar o diretório de destino, se necessário
    if (-not (Test-Path $DestinationPath)) {
        New-Item -ItemType Directory -Path $DestinationPath | Out-Null
    }

    # Processar os arquivos no diretório
    Get-ChildItem -Path $SourcePath -Recurse | ForEach-Object {
        if (-not (& $ExclusionLogic $_)) {
            $dest = Join-Path -Path $DestinationPath -ChildPath $_.FullName.Substring($SourcePath.Length).TrimStart("\")
            if ($_.PSIsContainer) {
                # Criar o diretório, se necessário
                if (-not (Test-Path $dest)) {
                    New-Item -ItemType Directory -Path $dest | Out-Null
                }
            } else {
                # Copiar o arquivo
                Copy-Item -Path $_.FullName -Destination $dest -Force
            }
        } else {
            Write-Host "Excluído: $($_.FullName)" -ForegroundColor Yellow
        }
    }
}

# Executar a cópia com exclusões
try {
    Copy-WithExclusion -SourcePath $source -DestinationPath $destination -ExclusionLogic $shouldExclude
    Write-Host "Arquivos copiados com sucesso de '$source' para '$destination'."
    return $true
} catch {
    Write-Error "Erro ao copiar arquivos: $_"
    return $false
}
