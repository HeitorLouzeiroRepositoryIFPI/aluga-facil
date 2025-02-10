import { NextRequest, NextResponse } from 'next/server';
import { ImoveisService } from '@/services/imoveis';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const imovel = await ImoveisService.cadastrar(data);
    
    return NextResponse.json(
      { message: 'Imóvel cadastrado com sucesso', data: imovel },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating imovel:', error);
    return NextResponse.json(
      { error: 'Erro ao cadastrar imóvel' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
